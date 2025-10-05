import React from 'react';
import type { Message, CaseStudy } from '../types';
import { UserIcon, RobotIcon } from './icons';

const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.sender === 'user';

  const formatAnalysis = (text: string) => {
    return text.split('\n').map((paragraph, index) => {
      if (paragraph.startsWith('**DISCLAIMER:**')) {
        return (
          <p key={index} className="mt-4 pt-4 border-t border-gray-300 text-sm text-gray-600">
            <strong className="font-semibold text-gray-800">DISCLAIMER:</strong> {paragraph.replace('**DISCLAIMER:**', '')}
          </p>
        );
      }
      if (paragraph.startsWith('* ')) {
         return <li key={index} className="ml-5 list-disc">{paragraph.substring(2)}</li>;
      }
      return <p key={index} className="mb-2 last:mb-0">{paragraph}</p>;
    });
  };

  const renderContent = () => {
    switch (message.type) {
      case 'caseStudy':
        const study = message.content as CaseStudy;
        return (
           <div className="space-y-4">
            <h3 className="text-xl font-bold text-teal-700 border-b pb-2">{study.title}</h3>
            <CaseStudySection title="Patient Profile">
                <p><strong>Age:</strong> {study.patientProfile.age}</p>
                <p><strong>Gender:</strong> {study.patientProfile.gender}</p>
                <p><strong>Background:</strong> {study.patientProfile.background}</p>
            </CaseStudySection>
            <CaseStudySection title="Presenting Complaint"><p>{study.presentingComplaint}</p></CaseStudySection>
            <CaseStudySection title="History of Presenting Illness"><p>{study.historyOfPresentingIllness}</p></CaseStudySection>
            <CaseStudySection title="Past Medical History"><p>{study.pastMedicalHistory}</p></CaseStudySection>
            <CaseStudySection title="Differential Diagnosis">
                <ul className="list-disc list-inside space-y-1">
                    {study.differentialDiagnosis.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </CaseStudySection>
            <CaseStudySection title="Investigations"><p>{study.investigations}</p></CaseStudySection>
            <CaseStudySection title="Management Plan"><p>{study.managementPlan}</p></CaseStudySection>
            <CaseStudySection title="Discussion Points">
                <ul className="list-disc list-inside space-y-1">
                    {study.discussionPoints.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
            </CaseStudySection>
        </div>
        );
      case 'error':
        return <p className="text-red-500">{message.content as string}</p>;
      case 'text':
      case 'welcome':
        return <div className="prose prose-slate max-w-none text-gray-800">{formatAnalysis(message.content as string)}</div>;
      default:
        return null;
    }
  };

  const Icon = isUser ? UserIcon : RobotIcon;
  const bubbleClasses = isUser
    ? 'bg-sky-600 text-white'
    : 'bg-white text-gray-800 border border-gray-200';
  const alignmentClasses = isUser ? 'justify-end' : 'justify-start';

  return (
    <div className={`flex items-start gap-3 my-4 animate-fade-in ${alignmentClasses}`}>
       {!isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-600" />
        </div>
      )}
      <div className={`max-w-2xl p-4 rounded-2xl shadow-sm ${bubbleClasses}`}>
        {renderContent()}
      </div>
      {isUser && (
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
          <Icon className="w-5 h-5 text-gray-700" />
        </div>
      )}
    </div>
  );
};

interface CaseStudySectionProps {
  title: string;
  children: React.ReactNode;
}

const CaseStudySection: React.FC<CaseStudySectionProps> = ({ title, children }) => (
  <div>
    <h4 className="text-lg font-semibold text-gray-800 mb-2">{title}</h4>
    <div className="text-gray-700 prose prose-slate max-w-none">{children}</div>
  </div>
);

export default ChatMessage;
