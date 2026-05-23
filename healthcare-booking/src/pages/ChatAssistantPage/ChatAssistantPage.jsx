import React from 'react';
import ChatAssistant from '../../components/features/ChatAssistant/ChatAssistant';
import './ChatAssistantPage.scss';

export default function ChatAssistantPage() {
  return (
    <div className="chat-assistant-page">
      <div className="page-header">
        <div className="header-content">
          <div>
            <h1>AI Health Assistant</h1>
            <p>Get instant answers about appointments, doctors, and health queries.</p>
          </div>
        </div>
      </div>
      <div className="chat-wrapper">
        <ChatAssistant />
      </div>
    </div>
  );
}
