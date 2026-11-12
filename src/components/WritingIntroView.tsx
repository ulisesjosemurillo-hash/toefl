/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, Clock, PenTool } from 'lucide-react';

interface WritingIntroViewProps {
  type: 'section_intro' | 'email_intro';
  onNext: () => void;
}

export const WritingIntroView: React.FC<WritingIntroViewProps> = ({
  type,
  onNext,
}) => {
  if (type === 'email_intro') {
    // Exact reproduction of image_1c165021.png
    return (
      <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14 flex flex-col justify-between min-h-0 select-none">
        <div className="mx-auto max-w-3xl w-full text-left pt-6">
          <div className="mb-6 border-b border-gray-200 pb-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Write an Email
            </h1>
          </div>

          <div className="space-y-6 text-base sm:text-lg text-gray-800 leading-relaxed">
            <p>
              You will read some information and use the information to write an email.
            </p>
            <p className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock size={20} className="text-[#0f6b64]" />
              You will have 7 minutes to write the email.
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
          <button
            onClick={onNext}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
          >
            <span>Continuar (Next)</span>
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    );
  }

  // Exact reproduction of image_8a6ac56f.png
  return (
    <div className="flex-1 overflow-y-auto bg-white p-8 sm:p-14 flex flex-col justify-between min-h-0 select-none">
      <div className="mx-auto max-w-3xl w-full text-left pt-6">
        <div className="mb-6 border-b border-gray-200 pb-3">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <PenTool size={26} className="text-[#0f6b64]" />
            Writing
          </h1>
        </div>

        <p className="mb-8 text-base sm:text-lg text-gray-800 leading-relaxed font-normal">
          In the writing section, you will answer 12 questions to demonstrate how well you can
          write in English. There are three types of tasks.
        </p>

        {/* Authentic ETS Table */}
        <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm max-w-2xl">
          <table className="w-full text-left text-sm sm:text-base border-collapse">
            <thead>
              <tr className="bg-[#f5b895] text-gray-900 border-b border-gray-400 font-bold">
                <th className="py-3 px-5 border-r border-gray-300 w-1/2">Type of Task</th>
                <th className="py-3 px-5 w-1/2">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white text-gray-800">
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-5 border-r border-gray-200 font-medium">Build a Sentence</td>
                <td className="py-3 px-5">Create a grammatical sentence.</td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-5 border-r border-gray-200 font-medium">Write an Email</td>
                <td className="py-3 px-5">Write an email using information provided.</td>
              </tr>
              <tr className="hover:bg-gray-50 transition">
                <td className="py-3 px-5 border-r border-gray-200 font-medium">
                  Write for an Academic Discussion
                </td>
                <td className="py-3 px-5">Participate in an online discussion.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto max-w-4xl w-full border-t border-gray-200 pt-6 mt-12 pb-4 flex items-center justify-end">
        <button
          onClick={onNext}
          className="inline-flex items-center gap-2 rounded-lg bg-[#0f6b64] px-7 py-3 text-sm font-bold text-white hover:bg-[#0c5650] transition shadow-md hover:shadow-lg transform active:scale-98"
        >
          <span>Continuar (Next)</span>
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};
