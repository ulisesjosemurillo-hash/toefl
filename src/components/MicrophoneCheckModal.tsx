/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  CheckCircle2,
  AlertCircle,
  Volume2,
  Play,
  Square,
  X,
  ChevronRight,
} from 'lucide-react';
import {
  requestMicrophoneAccess,
  createAudioLevelMeter,
  playBeepTone,
  getSavedMicDeviceId,
  setSavedMicDeviceId,
  getSupportedAudioMimeType,
} from '../utils/audioRecording.ts';

interface MicrophoneCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmed: () => void;
}

export const MicrophoneCheckModal: React.FC<MicrophoneCheckModalProps> = ({
  isOpen,
  onClose,
  onConfirmed,
}) => {
  const [permissionStatus, setPermissionStatus] = useState<
    'prompt' | 'granted' | 'denied'
  >('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isTestRecording, setIsTestRecording] = useState(false);
  const [testAudioUrl, setTestAudioUrl] = useState<string | null>(null);
  const [isPlayingTest, setIsPlayingTest] = useState(false);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>(() => getSavedMicDeviceId());

  const streamRef = useRef<MediaStream | null>(null);
  const meterCleanupRef = useRef<(() => void) | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const testAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const recordingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-request or test on modal open
  useEffect(() => {
    if (isOpen) {
      handleRequestPermission();
    } else {
      cleanupAudio();
    }
    return () => {
      cleanupAudio();
    };
  }, [isOpen]);

  const cleanupAudio = () => {
    if (meterCleanupRef.current) {
      meterCleanupRef.current();
      meterCleanupRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (testAudioElementRef.current) {
      testAudioElementRef.current.pause();
      testAudioElementRef.current = null;
    }
    setIsTestRecording(false);
    setIsPlayingTest(false);
  };

  const enumerateAudioDevices = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = allDevices.filter((d) => d.kind === 'audioinput');
        setDevices(audioInputs);
        const saved = getSavedMicDeviceId();
        if (saved && audioInputs.some((d) => d.deviceId === saved)) {
          setSelectedDeviceId(saved);
        } else if (audioInputs.length > 0 && !selectedDeviceId) {
          setSelectedDeviceId(audioInputs[0].deviceId);
          setSavedMicDeviceId(audioInputs[0].deviceId);
        }
      }
    } catch {}
  };

  const handleRequestPermission = async (deviceId?: string) => {
    setErrorMessage(null);
    const result = await requestMicrophoneAccess(deviceId);
    if (result.granted && result.stream) {
      streamRef.current = result.stream;
      setPermissionStatus('granted');

      // Enumerate available microphones
      await enumerateAudioDevices();

      // Start live VU meter
      if (meterCleanupRef.current) meterCleanupRef.current();
      meterCleanupRef.current = createAudioLevelMeter(result.stream, (level) => {
        setAudioLevel(level);
      });
    } else {
      setPermissionStatus('denied');
      setErrorMessage(
        result.error ||
          'No se pudo acceder al micrófono. Por favor permite el acceso en tu navegador.',
      );
    }
  };

  const handleDeviceChange = (newDeviceId: string) => {
    setSelectedDeviceId(newDeviceId);
    setSavedMicDeviceId(newDeviceId);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    handleRequestPermission(newDeviceId);
  };

  // Manual microphone test recording. The user controls when to stop.
  const handleStartTestRecording = () => {
    if (!streamRef.current || typeof MediaRecorder === 'undefined') {
      setErrorMessage('No hay un micrófono disponible para iniciar la grabación.');
      return;
    }
    playBeepTone(880, 200);
    audioChunksRef.current = [];
    setTestAudioUrl((previousUrl) => {
      if (previousUrl) URL.revokeObjectURL(previousUrl);
      return null;
    });
    setErrorMessage(null);

    try {
      const mimeType = getSupportedAudioMimeType();
      const recorder = mimeType
        ? new MediaRecorder(streamRef.current, { mimeType })
        : new MediaRecorder(streamRef.current);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onerror = () => {
        setIsTestRecording(false);
        setErrorMessage('Ocurrió un error durante la grabación de prueba. Inténtalo de nuevo.');
      };

      recorder.onstop = () => {
        if (recordingTimeoutRef.current) {
          clearTimeout(recordingTimeoutRef.current);
          recordingTimeoutRef.current = null;
        }
        const blob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        if (blob.size === 0) {
          setErrorMessage('La grabación está vacía. Comprueba el micrófono y vuelve a intentarlo.');
        } else {
          const url = URL.createObjectURL(blob);
          setTestAudioUrl(url);
        }
        setIsTestRecording(false);
      };

      recorder.start(250);
      setIsTestRecording(true);
      // Safety limit: stop automatically after 30 seconds if the user forgets.
      recordingTimeoutRef.current = setTimeout(() => {
        if (recorder.state === 'recording') recorder.stop();
      }, 30000);
    } catch (e: any) {
      setIsTestRecording(false);
      setErrorMessage(
        'Error al grabar audio de prueba: ' + (e.message || String(e)),
      );
    }
  };

  const handleStopTestRecording = () => {
    if (recordingTimeoutRef.current) {
      clearTimeout(recordingTimeoutRef.current);
      recordingTimeoutRef.current = null;
    }
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePlayTestAudio = () => {
    if (!testAudioUrl) return;
    if (testAudioElementRef.current) {
      testAudioElementRef.current.pause();
    }
    const audio = new Audio(testAudioUrl);
    testAudioElementRef.current = audio;
    setIsPlayingTest(true);

    audio.onended = () => setIsPlayingTest(false);
    audio.onerror = () => setIsPlayingTest(false);
    audio.play().catch(() => setIsPlayingTest(false));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 select-none">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-[#0f6b64] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-white/20 p-2 text-white">
              <Mic size={22} />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                Permiso y Prueba de Micrófono
              </h3>
              <p className="text-xs text-teal-100">
                TOEFL iBT® Official Speaking Setup
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-teal-100 hover:bg-white/20 hover:text-white transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
            Para evaluar tus respuestas en <strong>Listen and Repeat</strong>{' '}
            (10 segundos) y <strong>Take an Interview</strong> (45 segundos), el
            sistema necesita acceso a tu micrófono real para grabar tu voz,
            transcribirla y evaluar tu pronunciación y fluidez.
          </p>

          {/* Status Box */}
          {permissionStatus === 'granted' ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 space-y-4">
              <div className="flex items-center gap-2.5 text-emerald-900 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                <span>¡Micrófono conectado y detectando audio!</span>
              </div>

              {devices.length > 1 && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-emerald-900 block">
                    Dispositivo de entrada de audio:
                  </label>
                  <select
                    value={selectedDeviceId}
                    onChange={(e) => handleDeviceChange(e.target.value)}
                    className="w-full text-xs font-semibold rounded-lg border border-emerald-300 bg-white p-2 text-gray-800 shadow-2xs focus:ring-2 focus:ring-emerald-500"
                  >
                    {devices.map((d, idx) => (
                      <option key={d.deviceId || idx} value={d.deviceId}>
                        {d.label || `Micrófono ${idx + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Live VU Meter */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-emerald-800 font-semibold">
                  <span>Nivel de volumen en vivo:</span>
                  <span>{audioLevel}%</span>
                </div>
                <div className="h-3 w-full bg-emerald-100 rounded-full overflow-hidden border border-emerald-300">
                  <div
                    className={`h-full transition-all duration-75 rounded-full ${
                      audioLevel > 60
                        ? 'bg-emerald-500'
                        : audioLevel > 20
                        ? 'bg-teal-500'
                        : 'bg-emerald-300'
                    }`}
                    style={{ width: `${Math.max(4, audioLevel)}%` }}
                  />
                </div>
                <p className="text-[11px] text-gray-500 italic text-center">
                  Habla por tu micrófono ("Hello, test 1 2 3") para verificar
                  que la barra verde se mueva.
                </p>
              </div>

              {/* Manual microphone recording test */}
              <div className="pt-2 border-t border-emerald-200/60 flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={isTestRecording ? handleStopTestRecording : handleStartTestRecording}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition shadow-xs ${
                    isTestRecording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100'
                  }`}
                >
                  {isTestRecording ? <Square size={14} /> : <Mic size={14} />}
                  <span>
                    {isTestRecording
                      ? 'Detener grabación'
                      : 'Iniciar grabación de prueba'}
                  </span>
                </button>

                {testAudioUrl && (
                  <button
                    type="button"
                    onClick={handlePlayTestAudio}
                    disabled={isPlayingTest}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition shadow-xs"
                  >
                    <Play size={14} className="fill-white" />
                    <span>
                      {isPlayingTest ? 'Reproduciendo...' : 'Escuchar prueba'}
                    </span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-4 space-y-3">
              <div className="flex items-start gap-2.5 text-amber-900 text-xs sm:text-sm font-semibold">
                <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Se requiere permiso de micrófono</p>
                  <p className="text-xs text-amber-800 mt-0.5">
                    {errorMessage ||
                      'Haz clic en el botón de abajo para activar tu micrófono.'}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => handleRequestPermission()}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0f6b64] py-3 px-4 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] shadow-md transition transform active:scale-98"
                >
                  <Mic size={18} />
                  <span>Permitir Acceso al Micrófono</span>
                </button>
              </div>
            </div>
          )}

          {/* Microphone test instructions */}
          <div className="rounded-xl border border-teal-100 bg-teal-50/50 p-3.5 text-xs text-teal-950 flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f6b64] text-[10px] font-black text-white">
              ⏱
            </span>
            <div className="space-y-0.5">
              <p className="font-bold">
                Grabación de prueba controlada por ti:
              </p>
              <p className="text-gray-600 leading-relaxed text-[11px]">
                Pulsa “Iniciar grabación de prueba”, habla con normalidad y pulsa
                “Detener grabación” cuando termines. Puedes grabar hasta 30
                segundos; después podrás escucharla para comprobar que tu voz se
                registra correctamente.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
          >
            Configurar después
          </button>

          <button
            onClick={() => {
              cleanupAudio();
              onConfirmed();
            }}
            className="inline-flex items-center gap-2 rounded-xl bg-[#0f6b64] px-6 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-[#0c5650] shadow-md transition transform active:scale-98"
          >
            <span>Listo para el Speaking &gt;</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
