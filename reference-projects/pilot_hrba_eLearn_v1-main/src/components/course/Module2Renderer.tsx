/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import type { LearningState } from '../../state/learningState';
import { module2ContentRegistry } from '../../data/module2/module2Content';
import Module2LearningObjectives from './Module2LearningObjectives';
import Module2EverydayClaimsResponsibilities from './Module2EverydayClaimsResponsibilities';
import Module2RightsDimensionsHotspot from './Module2RightsDimensionsHotspot';
import Module2FourCharacteristicsPractice from './Module2FourCharacteristicsPractice';
import Module2RightsCharacteristicsMatch from './Module2RightsCharacteristicsMatch';
import Module2WorkingPrinciples from './Module2WorkingPrinciples';
import Module2RightsHoldersMap from './Module2RightsHoldersMap';
import Module2IntersectionalityCase from './Module2IntersectionalityCase';
import Module2ActorEcosystemRoles from './Module2ActorEcosystemRoles';
import Module2CSORoleEcosystem from './Module2CSORoleEcosystem';
import Module2SafeStandardsUse from './Module2SafeStandardsUse';
import Module2SdgLnobHrba from './Module2SdgLnobHrba';
import Module2ParticipationAttendance from './Module2ParticipationAttendance';
import Module2ParticipationPractice from './Module2ParticipationPractice';
import {
  Module2AccountabilityLoop,
  Module2FeedbackLoopRepair,
  Module2PowerExclusion,
  Module2EverydayRightsLensSynthesis,
  Module2IntroVideoScreen,
  Module2PortfolioCheckpointLens,
  Module2KnowledgeCheck,
  Module2CloseTransition,
  Module2TraceExclusionPathway,
} from './Module2AccountabilityPowerScreens';
import {
  matchingActivity,
  characteristicsQuickCheck,
  sortingActivity,
  standardsSafeUseCheck,
  scenarioDecision,
  finalFormativeQuiz
} from '../../data/module2/module_2_interaction_registry';
import { assetRegistry } from '../../data/module2/module_2_asset_registry';
import { portfolioFields, safetyHelperText } from '../../data/module2/module_2_portfolio_registry';
import '../../styles/module2-qa-upgrades.css';

interface Module2RendererProps {
  screenId: string;
  state: LearningState;
  onChangeState: (updater: (prev: LearningState) => LearningState) => void;
  onNext: () => void;
}

export default function Module2Renderer({
  screenId,
  state,
  onChangeState,
  onNext
}: Module2RendererProps) {
  const content = module2ContentRegistry[screenId];

  if (screenId === 'M2-S01A') {
    return (
      <Module2IntroVideoScreen
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S02') {
    return (
      <Module2LearningObjectives
        state={state}
        onChangeState={onChangeState}
        onNext={onNext}
      />
    );
  }

  if (screenId === 'M2-S03') {
    return (
      <Module2EverydayClaimsResponsibilities
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S04') {
    return (
      <Module2RightsDimensionsHotspot
        state={state}
        onChangeState={onChangeState}
        onNext={onNext}
      />
    );
  }

  if (screenId === 'M2-S05') {
    return (
      <Module2FourCharacteristicsPractice
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S06') {
    return (
      <Module2RightsCharacteristicsMatch
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S07') {
    return (
      <Module2WorkingPrinciples
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S08') {
    return (
      <Module2RightsHoldersMap
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S09') {
    return (
      <Module2IntersectionalityCase
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S10') {
    return (
      <Module2ActorEcosystemRoles
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S11') {
    return (
      <Module2CSORoleEcosystem
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S12') {
    return (
      <Module2SafeStandardsUse
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S13') {
    return (
      <Module2SdgLnobHrba
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S14') {
    return (
      <Module2ParticipationAttendance
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S15') {
    return (
      <Module2ParticipationPractice
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S16') {
    return (
      <Module2AccountabilityLoop
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S17') {
    return (
      <Module2FeedbackLoopRepair
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S18') {
    return (
      <Module2PowerExclusion
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S19') {
    return (
      <Module2TraceExclusionPathway
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S20') {
    return (
      <Module2EverydayRightsLensSynthesis
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S21') {
    return (
      <Module2PortfolioCheckpointLens
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S22') {
    return (
      <Module2KnowledgeCheck
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (screenId === 'M2-S23') {
    return (
      <Module2CloseTransition
        state={state}
        onChangeState={onChangeState}
      />
    );
  }

  if (!content && screenId !== 'M2-S23' && screenId !== 'M2-S01') {
    return (
      <div style={{ color: 'var(--text-main)', padding: '2rem', textAlign: 'center' }}>
        <h3>Loading screen content...</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Screen ID: {screenId}</p>
      </div>
    );
  }

  const blockType = content ? content.blockType : (screenId === 'M2-S23' ? 'completion_screen' : 'Module cover / Start state');

  return (
    <div
      key={screenId}
      style={{
        width: '100%',
        maxWidth: screenId === 'M2-S01' ? 'none' : '800px',
        margin: '0 auto',
        color: 'var(--text-main)'
      }}
    >
      {renderBlock(screenId, blockType, content, state, onChangeState, onNext)}
    </div>
  );
}

function renderBlock(
  screenId: string,
  blockType: string,
  content: any,
  state: LearningState,
  onChangeState: (updater: (prev: LearningState) => LearningState) => void,
  onNext: () => void
) {
  const primaryBg = 'var(--player-card-bg)';
  const borderCol = 'var(--color-border-dark)';

  switch (blockType) {
    case 'Module cover / Start state': // M2-PLAYER-00
      return (
        <section className="m2-cover-screen" aria-labelledby="m2-cover-title">
          <button
            type="button"
            className="m2-cover-screen__back"
            aria-label="Back to course page"
            onClick={() => {
              onChangeState((prev) => ({
                ...prev,
                currentLayer: 'platform',
                currentSubState: null,
                activeModal: null,
              }));
            }}
          >
            <span aria-hidden="true">&lt;</span>
            Back to course
          </button>
          <div className="m2-cover-screen__panel">
            <div className="m2-cover-screen__accent" aria-hidden="true"></div>
            <p className="m2-cover-screen__course">
              Applying the Human Rights-Based Approach in CSO Practice
            </p>
            <p className="m2-cover-screen__module">Module 2</p>
            <h1 id="m2-cover-title" className="m2-cover-screen__title">
              Foundations of HRBA: Rights, Actors, Principles, and Power
            </h1>
            <p className="m2-cover-screen__focus">
              Rights in Everyday CSO Work
            </p>
            <p className="m2-cover-screen__duration">
              <span aria-hidden="true"></span>
              Duration: 25–30 minutes
            </p>
            <button
              type="button"
              className="m2-cover-screen__cta"
              aria-label="Start Module 2 and go to Module 2, Screen 2"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.history.pushState(null, '', '/module-2/screen-2-2');
                }
                onNext();
              }}
            >
              <span>Start Module 2</span>
              <span className="m2-cover-screen__cta-icon" aria-hidden="true"></span>
            </button>
          </div>
          <figure className="m2-cover-screen__image-wrap">
            <img
              src="/assets/hrba/modules/module-2.png"
              alt="Cover image for Module 2 - Foundations of HRBA: Rights, Actors, Principles, and Power."
              className="m2-cover-screen__image"
            />
          </figure>
        </section>
      );

    case 'bridge_welcome':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          {content.content.paragraphs.map((p: string, idx: number) => (
            <p key={idx} style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>{p}</p>
          ))}
          {content.content.keyMessage && (
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--feedback-info-bg)', borderLeft: '4px solid var(--color-primary)', borderRadius: '4px' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>Key Message</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{content.content.keyMessage}</p>
            </div>
          )}
          <button onClick={onNext} className="btn-primary" style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'objectives_preview':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--text-main)' }}>Learning Outcomes:</strong>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingLeft: '1.25rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
              {content.content.paragraphs.slice(1).map((p: string, idx: number) => (
                <li key={idx}>{p}</li>
              ))}
            </ul>
          </div>
          {content.content.note && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--feedback-success-bg)', borderLeft: '4px solid var(--color-accent-green)', borderRadius: '4px', fontSize: '0.85rem', lineHeight: '1.4' }}>
              {content.content.note}
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'safety_reminder':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          {content.content.paragraphs.slice(0, 2).map((p: string, idx: number) => (
            <p key={idx} style={{ lineHeight: '1.6' }}>{p}</p>
          ))}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
            <div style={{ backgroundColor: 'var(--feedback-success-bg)', border: '1px solid rgba(145,200,82,0.2)', padding: '1.25rem', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-accent-green)', display: 'block', marginBottom: '0.75rem' }}>✓ What to Use:</strong>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li>Fictional local examples</li>
                <li>General community categories</li>
                <li>Broad CSO project areas</li>
                <li>Non-identifying descriptions</li>
              </ul>
            </div>
            <div style={{ backgroundColor: 'var(--feedback-warning-bg)', border: '1px solid rgba(245,158,11,0.2)', padding: '1.25rem', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: '0.75rem' }}>⚠️ What to Avoid:</strong>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <li>Real names of staff/communities</li>
                <li>Safeguarding protection cases</li>
                <li>Active complaint records</li>
                <li>Confidential records/data</li>
              </ul>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'var(--player-stage-soft)', padding: '1rem', borderRadius: '6px', border: `1px solid ${borderCol}` }}>
            <input 
              type="checkbox" 
              id="safety_check" 
              checked={state.m2SafeLearningReminderAccepted} 
              onChange={(e) => {
                onChangeState((prev: LearningState) => ({
                  ...prev,
                  m2SafeLearningReminderAccepted: e.target.checked
                }));
              }}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label htmlFor="safety_check" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              I promise to follow the safe learning and privacy guidelines.
            </label>
          </div>
          <button 
            onClick={onNext} 
            disabled={!state.m2SafeLearningReminderAccepted}
            style={{ 
              alignSelf: 'flex-end', 
              backgroundColor: state.m2SafeLearningReminderAccepted ? 'var(--color-primary)' : '#cbd5e1', 
              color: 'var(--text-main)', 
              border: 'none', 
              padding: '0.6rem 1.5rem', 
              borderRadius: '6px', 
              cursor: state.m2SafeLearningReminderAccepted ? 'pointer' : 'not-allowed', 
              fontWeight: 600 
            }}
          >
            {content.buttonText}
          </button>
        </div>
      );

    case 'reflective_opener':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          {content.content.paragraphs.map((p: string, idx: number) => (
            <p key={idx} style={{ lineHeight: '1.6' }}>{p}</p>
          ))}
          {content.content.note && (
            <div style={{ padding: '1.25rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, borderRadius: '8px', borderLeft: '4px solid var(--color-primary)' }}>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.25rem', fontSize: '0.95rem' }}>💭 Reflection Question</strong>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                Where do you see dignity, fairness, participation, or accountability in your CSO’s everyday work? (For thinking only; no writing required).
              </p>
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'explainer_card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>
          <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
            <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.5rem' }}>Practical Questions CSOs Ask:</strong>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingLeft: '1.1rem', fontSize: '0.85rem' }}>
              <li>Are community groups treated with dignity?</li>
              <li>Who may be excluded or benefiting less?</li>
              <li>Can local people participate in design and reviews?</li>
              <li>Do people have clear information in local languages?</li>
            </ul>
          </div>
          {content.content.keyMessage && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--feedback-info-bg)', borderLeft: '4px solid var(--color-primary)', borderRadius: '4px', fontSize: '0.9rem' }}>
              {content.content.keyMessage}
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'statement_block':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>
          {content.content.keyMessage && (
            <div style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', padding: '2rem', borderRadius: '12px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(59, 153, 212, 0.15)' }}>
              <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>💡</span>
              <p style={{ fontSize: '1.1rem', fontWeight: 600, lineHeight: '1.5' }}>{content.content.keyMessage}</p>
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'private_reflection_save':
      return (
        <PrivateReflectionBlock 
          screenId={screenId}
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'scenario_card':
    case 'case_scenario_card':
    case 'case_card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          {content.content.paragraphs.map((p: string, idx: number) => (
            <p key={idx} style={{ lineHeight: '1.6' }}>{p}</p>
          ))}
          {content.content.keyMessage && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--feedback-info-bg)', borderLeft: '4px solid var(--color-primary)', borderRadius: '4px', fontSize: '0.9rem' }}>
              {content.content.keyMessage}
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'labeled_hotspot':
      return (
        <HotspotBlock 
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'matching_block':
      return (
        <MatchingBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
        />
      );

    case 'worksheet_block':
      return (
        <WorksheetBlock 
          screenId={screenId}
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'portfolio_save_select':
      return (
        <PortfolioSaveSelectBlock 
          screenId={screenId}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'flashcards_block':
      return (
        <FlashcardsBlock 
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'mcq_quick_check':
      return (
        <MCQQuickCheckBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
        />
      );

    case 'tabs_block':
      return (
        <TabsBlock 
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'sorting_block':
      return (
        <SortingBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
        />
      );

    case 'timeline_block':
      return (
        <TimelineBlock 
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'checklist_card':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '0.5rem' }}>
            <div style={{ backgroundColor: 'var(--feedback-success-bg)', border: '1px solid rgba(145,200,82,0.2)', padding: '1.25rem', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-accent-green)', display: 'block', marginBottom: '0.75rem' }}>✓ Do Use Standards:</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                To check whether projects are inclusive, check local water availability guidelines, or map community safety expectations.
              </p>
            </div>
            <div style={{ backgroundColor: 'var(--feedback-warning-bg)', border: '1px solid rgba(245,158,11,0.2)', padding: '1.25rem', borderRadius: '8px' }}>
              <strong style={{ color: 'var(--color-warning)', display: 'block', marginBottom: '0.75rem' }}>✗ Do Not Use Standards:</strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                To make formal legal claims, publicly accuse regional administrations, or declare legal rights violations of individuals.
              </p>
            </div>
          </div>
          {content.content.note && (
            <div style={{ padding: '1rem', backgroundColor: 'var(--feedback-warning-bg)', border: '1.5px solid var(--color-warning)', borderRadius: '6px', fontSize: '0.85rem', color: 'var(--text-main)', fontStyle: 'italic', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span>⚠️</span>
              <span>{content.content.note}</span>
            </div>
          )}
          <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'checklist_block':
      return (
        <ChecklistBlock 
          content={content}
          onNext={onNext}
          onChangeState={onChangeState}
        />
      );

    case 'mcq_block':
      return (
        <SingleMCQBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'process_block':
      return (
        <ProcessBlock 
          content={content}
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'scenario_decision_block':
      return (
        <ScenarioDecisionBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'portfolio_checkpoint_block':
      return (
        <PortfolioCheckpointBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'quiz_block':
      return (
        <QuizBlock 
          state={state}
          onChangeState={onChangeState}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'summary_block':
      return (
        <SummaryTabsBlock 
          content={content}
          onNext={onNext}
          primaryBg={primaryBg}
          borderCol={borderCol}
        />
      );

    case 'next_step_block':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', textAlign: 'center', padding: '2rem 0' }}>
          <span style={{ fontSize: '3rem' }}>🏆</span>
          <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
          {content.content.paragraphs.map((p: string, idx: number) => (
            <p key={idx} style={{ lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>{p}</p>
          ))}
          <button onClick={onNext} style={{ alignSelf: 'center', backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.8rem 2.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontSize: '1rem', marginTop: '1rem', boxShadow: '0 4px 6px -1px rgba(145,200,82,0.3)' }}>
            {content.buttonText}
          </button>
        </div>
      );

    case 'completion_screen': // M2-PLAYER-COMPLETE
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center', padding: '2.5rem 0' }}>
          <div style={{ width: '80px', height: '80px', backgroundColor: 'var(--feedback-success-bg)', border: '2px solid var(--color-accent-green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}>
            ✓
          </div>
          <h3 style={{ fontSize: '2.25rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)', fontWeight: 800 }}>
            Module 2 Completed: Foundations of HRBA
          </h3>
          <p style={{ fontSize: '1rem', color: 'var(--text-muted)', maxWidth: '520px', lineHeight: '1.6' }}>
            Excellent work. You have successfully completed the core elements of Module 2. Your private learning reflections are saved securely in your browser's portfolio.
          </p>
          <button 
            onClick={() => {
              onChangeState((prev: LearningState) => ({
                ...prev,
                currentLayer: 'platform',
                currentModuleId: 'module_02_everyday_cso_work',
                completedModules: prev.completedModules.includes('module_02_everyday_cso_work')
                  ? prev.completedModules
                  : [...prev.completedModules, 'module_02_everyday_cso_work']
              }));
            }}
            style={{ 
              marginTop: '1.5rem', 
              backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', 
              border: 'none', 
              padding: '0.75rem 2rem', 
              borderRadius: '6px', 
              cursor: 'pointer', 
              fontWeight: 700, 
              fontSize: '1rem',
              boxShadow: '0 4px 6px -1px rgba(59, 153, 212, 0.3)' 
            }}
          >
            Return to Course Page
          </button>
        </div>
      );

    default:
      return (
        <div style={{ color: 'var(--text-main)', padding: '2rem', textAlign: 'center' }}>
          <h3>Unrecognized block layout</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Block Type: {blockType}</p>
          <button onClick={onNext} className="btn-primary" style={{ marginTop: '1rem' }}>Skip Screen</button>
        </div>
      );
  }
}

// Sub-components for cleaner codebase

function PrivateReflectionBlock({
  screenId,
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const fieldVal = screenId === 'M2-S2-04' 
    ? state.m2PlainLanguageRightsExplanation 
    : state.m2DecisionChangeNote;
  const [val, setVal] = useState(fieldVal || '');
  const [saved, setSaved] = useState(!!fieldVal);

  const handleSave = () => {
    onChangeState((prev: LearningState) => {
      if (screenId === 'M2-S2-04') {
        return { ...prev, m2PlainLanguageRightsExplanation: val };
      } else {
        return { ...prev, m2DecisionChangeNote: val };
      }
    });
    setSaved(true);
    setTimeout(() => {
      onNext();
    }, 800);
  };

  const handleSkip = () => {
    onNext();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      {content.content.paragraphs.map((p: string, idx: number) => (
        <p key={idx} style={{ lineHeight: '1.6' }}>{p}</p>
      ))}

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <label htmlFor="ref_note" style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem' }}>{content.content.note || "Your Reflection:"}</label>
        
        <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontStyle: 'italic', padding: '0.4rem', border: '1px solid rgba(245,158,11,0.2)', backgroundColor: 'var(--feedback-warning-bg)', borderRadius: '4px' }}>
          ⚠️ {safetyHelperText}
        </p>

        <textarea
          id="ref_note"
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            setSaved(false);
          }}
          placeholder="Write your private reflections here..."
          style={{ width: '100%', height: '120px', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', padding: '0.6rem', outline: 'none', fontSize: '0.875rem' }}
        />

        {saved && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-green)', fontWeight: 600 }}>
            ✓ Response saved privately in learning portfolio.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button onClick={handleSkip} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid #475569', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          {content.skipButtonText || 'Skip'}
        </button>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
          {content.buttonText}
        </button>
      </div>
    </div>
  );
}

function HotspotBlock({
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const items = [
    { key: 'information', label: '1. Information', desc: 'People need clear information about the meeting, the purpose, and how decisions will be used.' },
    { key: 'participation', label: '2. Participation', desc: 'People affected by the issue should have a meaningful chance to influence the discussion.' },
    { key: 'accessibility', label: '3. Accessibility', desc: 'The location, language, timing, and format should not exclude people.' },
    { key: 'equality', label: '4. Equality', desc: 'A CSO should ask which groups are less visible, less heard, or less able to benefit.' },
    { key: 'safety_and_dignity', label: '5. Safety & Dignity', desc: 'People should be able to participate without fear, humiliation, or pressure.' },
    { key: 'accountability', label: '6. Accountability', desc: 'People should know what happens after they give feedback or raise concerns.' }
  ];

  const handleOpenLabel = (key: string) => {
    onChangeState((prev: LearningState) => {
      const viewed = prev.m2HotspotViewed || [];
      const updated = viewed.includes(key) ? viewed : [...viewed, key];
      return { ...prev, m2HotspotViewed: updated };
    });
  };

  const isAllViewed = (state.m2HotspotViewed || []).length === items.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      {/* SVG visual placeholder representing hotspot mapping */}
      <div style={{ backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>
        <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '0.4rem', fontSize: '0.85rem' }}>Visual Map: hrba-m02-everyday-rights-hotspot.svg</strong>
        <p style={{ fontSize: '0.75rem', maxWidth: '500px', margin: '0 auto 1.25rem' }}>
          {assetRegistry['A-M2-03']?.altText}
        </p>
        
        {/* Labeled graphic hotspots triggers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', maxWidth: '600px', margin: '0 auto' }}>
          {items.map((it) => {
            const viewed = (state.m2HotspotViewed || []).includes(it.key);
            return (
              <button
                key={it.key}
                onClick={() => handleOpenLabel(it.key)}
                style={{
                  padding: '0.5rem',
                  backgroundColor: viewed ? 'rgba(145,200,82,0.1)' : 'rgba(59,153,212,0.1)',
                  border: viewed ? '1px solid var(--color-accent-green)' : '1px solid var(--color-primary)',
                  color: viewed ? 'var(--color-accent-green)' : 'var(--color-primary)',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {it.label} {viewed ? '✓' : ''}
              </button>
            );
          })}
        </div>
      </div>

      {/* Detailed cards block based on selections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {items.map((it) => {
          const viewed = (state.m2HotspotViewed || []).includes(it.key);
          if (!viewed) return null;
          return (
            <div key={it.key} style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1rem', borderRadius: '6px', borderLeft: '4px solid var(--color-accent-green)' }}>
              <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>{it.label} rights dimension:</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: '1.4' }}>{it.desc}</p>
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!isAllViewed}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: isAllViewed ? 'var(--button-primary-bg)' : '#cbd5e1', color: 'var(--button-primary-text)',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          cursor: isAllViewed ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}
      >
        {isAllViewed ? 'Continue' : `Open all labels to continue (${(state.m2HotspotViewed || []).length}/6)`}
      </button>
    </div>
  );
}

function MatchingBlock({
  state,
  onChangeState,
  onNext
}: any) {
  const answers = state.m2MatchingState || {};
  const checked = state.m2MatchingCompleted;

  const categories = [
    "Participation",
    "Equality and non-discrimination",
    "Access to information",
    "Accountability",
    "Accessibility of services",
    "Safety and dignity"
  ];

  const handleSelect = (itemId: number, matchVal: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2MatchingState: {
        ...prev.m2MatchingState,
        [itemId]: matchVal
      }
    }));
  };

  const isAllAnswered = matchingActivity.every((item) => answers[item.id]);

  const handleCheck = () => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2MatchingCompleted: true
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Match the Everyday Issue to a Rights Dimension
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Assign each fictional program example to its corresponding rights dimension using select boxes:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {matchingActivity.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#1e293b', border: '1px solid var(--color-border-dark)', padding: '1rem', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}><strong>Example {item.id}:</strong> {item.text}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={answers[item.id] || ''}
                onChange={(e) => handleSelect(item.id, e.target.value)}
                disabled={checked}
                style={{ padding: '0.4rem', backgroundColor: 'var(--player-stage-soft)', border: '1px solid var(--color-border-dark)', color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem', flexGrow: 1 }}
              >
                <option value="">-- Choose Dimension --</option>
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>

              {checked && (
                <span style={{ fontSize: '1.25rem' }}>
                  {answers[item.id] === item.correctMatch ? '✅' : '◻️'}
                </span>
              )}
            </div>
            
            {checked && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: answers[item.id] === item.correctMatch ? 'var(--color-accent-green)' : 'var(--color-warning)' }}>
                {answers[item.id] === item.correctMatch ? item.bestFeedback : item.weakerFeedback}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {!checked ? (
          <button 
            onClick={handleCheck} 
            disabled={!isAllAnswered}
            style={{ backgroundColor: isAllAnswered ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: isAllAnswered ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Check Matches
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function WorksheetBlock({
  screenId,
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const fields = screenId === 'M2-S3-04' 
    ? ["issue", "groups", "dimensions", "excluded", "gaps", "actors"]
    : ["project", "holders", "exclusion", "dimensions", "duty_bearers", "participation", "accountability", "safety", "action"];

  const worksheetState = screenId === 'M2-S3-04' 
    ? (state.m2EverydayRightsMap || {})
    : (state.m2RightsRelevanceWorksheet || {});

  const handleFieldChange = (key: string, val: string) => {
    onChangeState((prev: LearningState) => {
      if (screenId === 'M2-S3-04') {
        return {
          ...prev,
          m2EverydayRightsMap: { ...prev.m2EverydayRightsMap, [key]: val }
        };
      } else {
        return {
          ...prev,
          m2RightsRelevanceWorksheet: { ...prev.m2RightsRelevanceWorksheet, [key]: val }
        };
      }
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      {content.content.paragraphs.map((p: string, idx: number) => (
        <p key={idx} style={{ lineHeight: '1.5', fontSize: '0.85rem' }}>{p}</p>
      ))}

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', backgroundColor: 'var(--player-stage-soft)', padding: '0.75rem 1rem', borderRadius: '6px', border: `1px solid ${borderCol}` }}>
        <span style={{ fontSize: '1.5rem' }}>📥</span>
        <div>
          <strong style={{ color: 'var(--text-main)', fontSize: '0.85rem' }}>Downloadable Worksheet</strong>
          <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b' }}>
            File: {screenId === 'M2-S3-04' ? 'hrba-m02-everyday-rights-map.pdf' : 'hrba-m02-rights-relevance-worksheet.pdf'}
          </span>
        </div>
        <button 
          onClick={() => alert("Worksheet PDF download is simulated for the prototype build.")}
          style={{ marginLeft: 'auto', backgroundColor: 'transparent', border: '1px solid var(--color-primary)', color: 'var(--color-primary)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
        >
          Download PDF
        </button>
      </div>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <strong style={{ color: 'var(--text-main)', fontSize: '0.9rem' }}>In-Platform Worksheet Form Fields:</strong>
        
        <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontStyle: 'italic' }}>
          ⚠️ {safetyHelperText}
        </p>

        {fields.map((fld) => (
          <div key={fld} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
            <label htmlFor={`fld_${fld}`} style={{ fontSize: '0.8rem', color: 'var(--text-main)', textTransform: 'capitalize', fontWeight: 600 }}>
              {fld.replace('_', ' ')}:
            </label>
            <input
              id={`fld_${fld}`}
              type="text"
              value={worksheetState[fld] || ''}
              onChange={(e) => handleFieldChange(fld, e.target.value)}
              placeholder={`Enter broad details for ${fld.replace('_', ' ')}...`}
              style={{ padding: '0.4rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
            />
          </div>
        ))}
      </div>

      <button onClick={onNext} style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
        Save and Continue
      </button>
    </div>
  );
}

function PortfolioSaveSelectBlock({
  screenId,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const isM2S3 = screenId === 'M2-S3-05';
  
  const issueOptions = portfolioFields.m2_issue_area.options || [];
  const dimOptions = portfolioFields.m2_rights_dimensions.options || [];
  const typeOptions = portfolioFields.m2_rights_types?.options || [
    "Civil rights", "Political rights", "Economic rights", "Social rights", "Cultural rights", "Collective rights"
  ];

  const [issue, setIssue] = useState(state.m2EverydayRightsIssue || '');
  const [dim, setDim] = useState(state.m2EverydayRightsDimension || '');
  const [type, setType] = useState(state.m2RightsType || '');
  const [note, setNote] = useState(state.m2RightsTypeNote || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onChangeState((prev: LearningState) => {
      if (isM2S3) {
        return {
          ...prev,
          m2EverydayRightsIssue: issue,
          m2EverydayRightsDimension: dim
        };
      } else {
        return {
          ...prev,
          m2RightsType: type,
          m2RightsTypeNote: note
        };
      }
    });
    setSaved(true);
    setTimeout(() => {
      onNext();
    }, 850);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        {isM2S3 ? 'Add to My Portfolio: One Everyday Rights Issue' : 'Add to My Portfolio: Rights Type Relevance'}
      </h3>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          These selections are saved privately to your local HRBA learning portfolio to compile your Everyday Rights Lens checkpoint.
        </p>

        {isM2S3 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label htmlFor="p_issue" style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>What broad CSO issue or work area did you map?</label>
              <select
                id="p_issue"
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
                style={{ padding: '0.5rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value="">-- Choose Issue Area --</option>
                {issueOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label htmlFor="p_dim" style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Which rights dimension did you notice first?</label>
              <select
                id="p_dim"
                value={dim}
                onChange={(e) => setDim(e.target.value)}
                style={{ padding: '0.5rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value="">-- Choose Rights Dimension --</option>
                {dimOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label htmlFor="p_type" style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Which rights type matches your current project area?</label>
              <select
                id="p_type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{ padding: '0.5rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
              >
                <option value="">-- Choose Rights Type --</option>
                {typeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              <label htmlFor="p_note" style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Write a brief, private reflection note:</label>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontStyle: 'italic' }}>⚠️ {safetyHelperText}</p>
              <textarea
                id="p_note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Optional private details..."
                style={{ width: '100%', height: '80px', padding: '0.4rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem' }}
              />
            </div>
          </>
        )}

        {saved && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-green)', fontWeight: 600 }}>
            ✓ Portfolio selections saved privately.
          </div>
        )}
      </div>

      <button 
        onClick={handleSave}
        disabled={isM2S3 ? (!issue || !dim) : !type}
        style={{ 
          alignSelf: 'flex-end', 
          backgroundColor: (isM2S3 ? (issue && dim) : type) ? 'var(--color-accent-green)' : '#cbd5e1', 
          color: 'var(--text-main)', 
          border: 'none', 
          padding: '0.6rem 1.5rem', 
          borderRadius: '6px', 
          cursor: (isM2S3 ? (issue && dim) : type) ? 'pointer' : 'not-allowed', 
          fontWeight: 700 
        }}
      >
        Save and Continue
      </button>
    </div>
  );
}

function FlashcardsBlock({
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const cards = content.content.tabs || [];
  
  const handleOpenCard = (title: string) => {
    onChangeState((prev: LearningState) => {
      const viewed = prev.m2FlashcardsViewed || [];
      const updated = viewed.includes(title) ? viewed : [...viewed, title];
      return { ...prev, m2FlashcardsViewed: updated };
    });
  };

  const isAllViewed = (state.m2FlashcardsViewed || []).length === cards.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      {/* SVG Placeholder representing cards */}
      <div style={{ backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, padding: '1rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        <strong>Visual cards placeholder: hrba-m02-rights-characteristics-cards.svg</strong>
        <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{assetRegistry['A-M2-05']?.altText}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {cards.map((c: any) => {
          const viewed = (state.m2FlashcardsViewed || []).includes(c.title);
          return (
            <div 
              key={c.title}
              onClick={() => handleOpenCard(c.title)}
              style={{
                backgroundColor: viewed ? primaryBg : '#0f172a',
                border: viewed ? '1.5px solid var(--color-accent-green)' : `1px dashed ${borderCol}`,
                borderRadius: '8px',
                padding: '1.25rem',
                cursor: 'pointer',
                textAlign: 'center',
                boxShadow: viewed ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                minHeight: '120px'
              }}
            >
              <h4 style={{ color: viewed ? 'var(--color-accent-green)' : 'var(--color-primary)', fontSize: '1.1rem', margin: 0 }}>
                {c.title} {viewed ? '✓' : ''}
              </h4>
              
              {viewed ? (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: '1.4' }}>
                  {c.description}
                </p>
              ) : (
                <span style={{ display: 'block', fontSize: '0.75rem', color: '#475569', marginTop: '0.5rem' }}>
                  Click to open card
                </span>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!isAllViewed}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: isAllViewed ? 'var(--button-primary-bg)' : '#cbd5e1', color: 'var(--button-primary-text)',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          cursor: isAllViewed ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}
      >
        {isAllViewed ? 'Continue' : `Open all cards to continue (${(state.m2FlashcardsViewed || []).length}/4)`}
      </button>
    </div>
  );
}

function MCQQuickCheckBlock({
  state,
  onChangeState,
  onNext
}: any) {
  const answers = state.m2QuizAnswers || {};
  const [checked, setChecked] = useState(false);

  const handleSelect = (qId: number, optionKey: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2QuizAnswers: {
        ...prev.m2QuizAnswers,
        [`check_${qId}`]: optionKey
      }
    }));
  };

  const isAllAnswered = characteristicsQuickCheck.every((q) => answers[`check_${q.id}`]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Quick Check: Rights Characteristics
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {characteristicsQuickCheck.map((q) => {
          const selected = answers[`check_${q.id}`];
          return (
            <div key={q.id} style={{ backgroundColor: '#1e293b', border: '1px solid var(--color-border-dark)', padding: '1.25rem', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
                {q.id}. {q.question}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {q.options.map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: checked ? 'default' : 'pointer' }}>
                    <input
                      type="radio"
                      name={`check_${q.id}`}
                      value={opt.key}
                      checked={selected === opt.key}
                      onChange={() => handleSelect(q.id, opt.key)}
                      disabled={checked}
                      style={{ cursor: checked ? 'default' : 'pointer' }}
                    />
                    <span>{opt.key}. {opt.text}</span>
                  </label>
                ))}
              </div>

              {checked && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: selected === q.correctKey ? 'rgba(145,200,82,0.1)' : 'rgba(249,115,22,0.1)', color: selected === q.correctKey ? 'var(--color-accent-green)' : 'var(--color-warning)' }}>
                  {q.feedback[selected]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {!checked ? (
          <button 
            onClick={() => setChecked(true)} 
            disabled={!isAllAnswered}
            style={{ backgroundColor: isAllAnswered ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: isAllAnswered ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Check Answers
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function TabsBlock({
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const tabs = content.content.tabs || [];
  const [activeTab, setActiveTab] = useState(0);

  const handleTabClick = (idx: number) => {
    setActiveTab(idx);
    onChangeState((prev: LearningState) => {
      const viewed = prev.m2TabsViewed || [];
      const title = tabs[idx].title;
      const updated = viewed.includes(title) ? viewed : [...viewed, title];
      return { ...prev, m2TabsViewed: updated };
    });
  };

  const isAllViewed = (state.m2TabsViewed || []).length === tabs.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      {/* Diagram Placeholder */}
      <div style={{ backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, padding: '1rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        <strong>Visual Types Diagram: hrba-m02-rights-types-diagram.svg</strong>
        <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{assetRegistry['A-M2-06']?.altText}</p>
      </div>

      <div style={{ display: 'flex', borderBottom: `2px solid ${borderCol}`, gap: '0.25rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
        {tabs.map((tb: any, idx: number) => {
          const active = activeTab === idx;
          const viewed = (state.m2TabsViewed || []).includes(tb.title);
          return (
            <button
              key={tb.title}
              onClick={() => handleTabClick(idx)}
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: active ? 'rgba(59,153,212,0.15)' : 'transparent',
                border: 'none',
                color: active ? '#fff' : (viewed ? '#94a3b8' : '#64748b'),
                borderBottom: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                whiteSpace: 'nowrap'
              }}
            >
              {tb.title} {viewed ? '✓' : ''}
            </button>
          );
        })}
      </div>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px', minHeight: '100px' }}>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginTop: 0, marginBottom: '0.5rem' }}>{tabs[activeTab]?.title}</h4>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>{tabs[activeTab]?.description}</p>
      </div>

      <button
        onClick={onNext}
        disabled={!isAllViewed}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: isAllViewed ? 'var(--button-primary-bg)' : '#cbd5e1', color: 'var(--button-primary-text)',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          cursor: isAllViewed ? 'pointer' : 'not-allowed',
          fontWeight: 600
        }}
      >
        {isAllViewed ? 'Continue' : `View all tabs to continue (${(state.m2TabsViewed || []).length}/6)`}
      </button>
    </div>
  );
}

function SortingBlock({
  state,
  onChangeState,
  onNext
}: any) {
  const answers = state.m2SortingState || {};
  const checked = state.m2SortingCompleted;

  const categories = [
    "Civil rights",
    "Political rights",
    "Economic rights",
    "Social rights",
    "Cultural rights",
    "Collective rights"
  ];

  const handleSelect = (itemId: number, categoryVal: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2SortingState: {
        ...prev.m2SortingState,
        [itemId]: categoryVal
      }
    }));
  };

  const isAllAnswered = sortingActivity.every((item) => answers[item.id]);

  const handleCheck = () => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2SortingCompleted: true
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Sort the Example by Rights Type
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Assign each example to its corresponding rights type using dropdowns:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sortingActivity.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#1e293b', border: '1px solid var(--color-border-dark)', padding: '1rem', borderRadius: '8px' }}>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}><strong>Example {item.id}:</strong> {item.text}</p>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <select
                value={answers[item.id] || ''}
                onChange={(e) => handleSelect(item.id, e.target.value)}
                disabled={checked}
                style={{ padding: '0.4rem', backgroundColor: 'var(--player-stage-soft)', border: '1px solid var(--color-border-dark)', color: 'var(--text-main)', borderRadius: '4px', outline: 'none', fontSize: '0.85rem', flexGrow: 1 }}
              >
                <option value="">-- Choose Rights Type --</option>
                {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
              </select>

              {checked && (
                <span style={{ fontSize: '1.25rem' }}>
                  {answers[item.id] === item.correctCategory ? '✅' : '◻️'}
                </span>
              )}
            </div>
            
            {checked && (
              <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: answers[item.id] === item.correctCategory ? 'var(--color-accent-green)' : 'var(--color-warning)' }}>
                {answers[item.id] === item.correctCategory ? item.bestFeedback : item.weakerFeedback}
              </p>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {!checked ? (
          <button 
            onClick={handleCheck} 
            disabled={!isAllAnswered}
            style={{ backgroundColor: isAllAnswered ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: isAllAnswered ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Check Matches
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function TimelineBlock({
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const points = content.content.timelinePoints || [];
  const [activeIdx, setActiveIdx] = useState(0);

  const handlePointClick = (idx: number) => {
    setActiveIdx(idx);
    onChangeState((prev: LearningState) => {
      const viewed = prev.m2TimelineViewed || [];
      const title = points[idx].title;
      const updated = viewed.includes(title) ? viewed : [...viewed, title];
      return { ...prev, m2TimelineViewed: updated };
    });
  };

  const isAllViewed = (state.m2TimelineViewed || []).length === points.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      {/* SVG Placeholder representing timeline */}
      <div style={{ backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, padding: '1rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        <strong>Visual Timeline Graphic: hrba-m02-human-rights-systems-timeline.svg</strong>
        <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{assetRegistry['A-M2-07']?.altText}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
        {points.map((pt: any, idx: number) => {
          const viewed = (state.m2TimelineViewed || []).includes(pt.title);
          const active = activeIdx === idx;
          return (
            <div key={pt.title} style={{ borderBottom: idx < points.length - 1 ? `1px solid ${borderCol}` : 'none', paddingBottom: '0.75rem', paddingTop: idx > 0 ? '0.75rem' : 0 }}>
              <button
                onClick={() => handlePointClick(idx)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: active ? '#fff' : (viewed ? '#cbd5e1' : '#64748b'),
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{pt.title} {viewed ? '✓' : ''}</span>
                <span>{active ? '▼' : '▶'}</span>
              </button>
              
              {active && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
                  {pt.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!isAllViewed}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: isAllViewed ? 'var(--button-primary-bg)' : '#cbd5e1', color: 'var(--button-primary-text)',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          cursor: isAllViewed ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}
      >
        {isAllViewed ? 'Continue' : `Expand all points to continue (${(state.m2TimelineViewed || []).length}/5)`}
      </button>
    </div>
  );
}

function ChecklistBlock({
  content,
  onNext,
  onChangeState
}: any) {
  const items = content.content.listItems || [];
  
  const handleReview = () => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2StandardsChecklistReviewed: true
    }));
    onNext();
  };
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: '#1e293b', border: '1px solid var(--color-border-dark)', padding: '1.5rem', borderRadius: '8px' }}>
        <strong style={{ color: 'var(--text-main)', fontSize: '0.95rem', marginBottom: '0.25rem', display: 'block' }}>Core Safe-Use Commitments:</strong>
        {items.map((it: string, idx: number) => (
          <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <span style={{ color: 'var(--color-accent-green)', fontWeight: 'bold' }}>✓</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{it}</span>
          </div>
        ))}
      </div>

      <button onClick={handleReview} className="btn-primary" style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
        {content.buttonText}
      </button>
    </div>
  );
}

function SingleMCQBlock({
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const q = standardsSafeUseCheck;
  const answers = state.m2QuizAnswers || {};
  const selected = answers[`standards_check`];
  const [checked, setChecked] = useState(!!selected);

  const handleSelect = (optionKey: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2QuizAnswers: {
        ...prev.m2QuizAnswers,
        standards_check: optionKey
      }
    }));
  };

  const handleCheck = () => {
    setChecked(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Quick Check: Using Standards Safely
      </h3>
      
      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          {q.question}
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {q.options.map((opt) => (
            <label key={opt.key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: checked ? 'default' : 'pointer' }}>
              <input
                type="radio"
                name="standards_check"
                value={opt.key}
                checked={selected === opt.key}
                onChange={() => handleSelect(opt.key)}
                disabled={checked}
                style={{ cursor: checked ? 'default' : 'pointer' }}
              />
              <span>{opt.key}. {opt.text}</span>
            </label>
          ))}
        </div>

        {checked && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: selected === q.correctKey ? 'rgba(145,200,82,0.1)' : 'rgba(249,115,22,0.1)', color: selected === q.correctKey ? 'var(--color-accent-green)' : 'var(--color-warning)', lineHeight: '1.4' }}>
            {q.feedback[selected]}
          </div>
        )}
      </div>

      <div style={{ padding: '0.85rem', backgroundColor: 'var(--feedback-warning-bg)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '4px', fontSize: '0.8rem', fontStyle: 'italic', display: 'flex', gap: '0.5rem' }}>
        <span>⚠️</span>
        <span>This course supports learning and practical reflection. It does not provide legal advice.</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {!checked ? (
          <button 
            onClick={handleCheck} 
            disabled={!selected}
            style={{ backgroundColor: selected ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: selected ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Submit Choice
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function ProcessBlock({
  content,
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const steps = content.content.timelinePoints || [];
  const [activeIdx, setActiveIdx] = useState(0);

  const handleStepClick = (idx: number) => {
    setActiveIdx(idx);
    onChangeState((prev: LearningState) => {
      const viewed = prev.m2ProcessViewed || [];
      const title = steps[idx].title;
      const updated = viewed.includes(title) ? viewed : [...viewed, title];
      return { ...prev, m2ProcessViewed: updated };
    });
  };

  const isAllViewed = (state.m2ProcessViewed || []).length === steps.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      {/* SVG Placeholder representing process */}
      <div style={{ backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, padding: '1rem', borderRadius: '8px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.5rem' }}>
        <strong>Visual Process Cycle: hrba-m02-rights-in-project-cycle.svg</strong>
        <p style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>{assetRegistry['A-M2-09']?.altText}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
        {steps.map((pt: any, idx: number) => {
          const viewed = (state.m2ProcessViewed || []).includes(pt.title);
          const active = activeIdx === idx;
          return (
            <div key={pt.title} style={{ borderBottom: idx < steps.length - 1 ? `1px solid ${borderCol}` : 'none', paddingBottom: '0.75rem', paddingTop: idx > 0 ? '0.75rem' : 0 }}>
              <button
                onClick={() => handleStepClick(idx)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  color: active ? '#fff' : (viewed ? '#cbd5e1' : '#64748b'),
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{pt.title} {viewed ? '✓' : ''}</span>
                <span>{active ? '▼' : '▶'}</span>
              </button>
              
              {active && (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: '1.4' }}>
                  {pt.description}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onNext}
        disabled={!isAllViewed}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: isAllViewed ? 'var(--button-primary-bg)' : '#cbd5e1', color: 'var(--button-primary-text)',
          border: 'none',
          padding: '0.6rem 1.5rem',
          borderRadius: '6px',
          cursor: isAllViewed ? 'pointer' : 'not-allowed',
          fontWeight: 600,
          marginTop: '0.5rem'
        }}
      >
        {isAllViewed ? 'Continue' : `Expand all steps to continue (${(state.m2ProcessViewed || []).length}/6)`}
      </button>
    </div>
  );
}

function ScenarioDecisionBlock({
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const answers = state.m2QuizAnswers || {};
  const selected = answers[`scenario_decision`];
  const [checked, setChecked] = useState(!!selected);

  const handleSelect = (optionKey: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2QuizAnswers: {
        ...prev.m2QuizAnswers,
        scenario_decision: optionKey
      }
    }));
  };

  const handleCheck = () => {
    setChecked(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Scenario Decision: The Most Rights-Based Next Step
      </h3>
      
      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', backgroundColor: 'var(--player-stage-soft)', padding: '1rem', borderRadius: '8px', border: `1px solid ${borderCol}` }}>
        <strong>Scenario: </strong>
        Lomi Community Development Association is planning a consultation on improving access to local services. The team has prepared a meeting agenda and wants to invite community representatives. Ayele notices that some groups are often missing from similar meetings, including people with disabilities, women with care responsibilities, young people, and people from remote areas.
      </p>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
        <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.75rem' }}>
          What is the most rights-based next step?
        </p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {scenarioDecision.options.map((opt) => (
            <label key={opt.key} style={{ display: 'flex', gap: '0.75rem', padding: '0.6rem', border: selected === opt.key ? '1px solid var(--color-primary)' : '1px solid transparent', borderRadius: '6px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: checked ? 'default' : 'pointer', backgroundColor: selected === opt.key ? 'rgba(59,153,212,0.05)' : 'transparent' }}>
              <input
                type="radio"
                name="scenario_decision"
                value={opt.key}
                checked={selected === opt.key}
                onChange={() => handleSelect(opt.key)}
                disabled={checked}
                style={{ cursor: checked ? 'default' : 'pointer' }}
              />
              <span>{opt.key}. {opt.text}</span>
            </label>
          ))}
        </div>

        {checked && (
          <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: selected === scenarioDecision.correctKey ? 'rgba(145,200,82,0.1)' : 'rgba(249,115,22,0.1)', color: selected === scenarioDecision.correctKey ? 'var(--color-accent-green)' : 'var(--color-warning)', lineHeight: '1.4' }}>
            {scenarioDecision.feedback[selected]}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
        {!checked ? (
          <button 
            onClick={handleCheck} 
            disabled={!selected}
            style={{ backgroundColor: selected ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: selected ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Submit Choice
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function PortfolioCheckpointBlock({
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const fields = Object.values(portfolioFields);
  
  const [formData, setFormData] = useState<Record<string, any>>(state.m2EverydayRightsLens || {});
  const [saved, setSaved] = useState(false);

  const handleSelectChange = (fieldId: string, val: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, [fieldId]: val }));
    setSaved(false);
  };

  const handleMultiSelectChange = (fieldId: string, val: string) => {
    setFormData((prev: Record<string, any>) => {
      const current = prev[fieldId] || [];
      const updated = current.includes(val) 
        ? current.filter((x: string) => x !== val)
        : [...current, val];
      return { ...prev, [fieldId]: updated };
    });
    setSaved(false);
  };

  const handleTextChange = (val: string) => {
    setFormData((prev: Record<string, any>) => ({ ...prev, m2_private_note: val }));
    setSaved(false);
  };

  const handleSave = () => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2EverydayRightsLens: formData
    }));
    setSaved(true);
    setTimeout(() => {
      onNext();
    }, 850);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Add to My Portfolio: My Everyday Rights Lens
      </h3>
      <p style={{ fontSize: '0.85rem' }}>
        Complete the structured fields to save your final Module 2 checkpoint. Your answers are saved locally in your browser's private portfolio.
      </p>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ fontSize: '0.75rem', color: 'var(--color-warning)', fontStyle: 'italic' }}>⚠️ {safetyHelperText}</p>

        {fields.map((fld) => {
          if (fld.type === 'select') {
            return (
              <div key={fld.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label htmlFor={`sel_${fld.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{fld.label}</label>
                <select
                  id={`sel_${fld.id}`}
                  value={formData[fld.id] || ''}
                  onChange={(e) => handleSelectChange(fld.id, e.target.value)}
                  style={{ padding: '0.5rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
                >
                  <option value="">-- Choose Option --</option>
                  {fld.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            );
          }
          if (fld.type === 'multiselect') {
            return (
              <div key={fld.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{fld.label}</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', backgroundColor: 'var(--player-stage-soft)', padding: '0.75rem', borderRadius: '4px', border: `1px solid ${borderCol}` }}>
                  {fld.options?.map((opt) => {
                    const active = (formData[fld.id] || []).includes(opt);
                    return (
                      <label key={opt} style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', fontSize: '0.75rem', color: active ? 'var(--color-primary)' : '#94a3b8', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={active}
                          onChange={() => handleMultiSelectChange(fld.id, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          }
          if (fld.type === 'textarea') {
            return (
              <div key={fld.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                <label htmlFor={`tx_${fld.id}`} style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>{fld.label}</label>
                <textarea
                  id={`tx_${fld.id}`}
                  value={formData.m2_private_note || ''}
                  onChange={(e) => handleTextChange(e.target.value)}
                  placeholder={fld.placeholder}
                  style={{ width: '100%', height: '80px', padding: '0.4rem', backgroundColor: 'var(--player-stage-soft)', border: `1px solid ${borderCol}`, color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.85rem', outline: 'none' }}
                />
              </div>
            );
          }
          return null;
        })}

        {saved && (
          <div style={{ fontSize: '0.8rem', color: 'var(--color-accent-green)', fontWeight: 600 }}>
            ✓ Final Module 2 portfolio checkpoint saved privately.
          </div>
        )}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
        <button onClick={onNext} style={{ backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid #475569', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
          Skip portfolio for now
        </button>
        <button onClick={handleSave} style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 2rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}>
          Save to my portfolio
        </button>
      </div>
    </div>
  );
}

function QuizBlock({
  state,
  onChangeState,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const answers = state.m2QuizAnswers || {};
  const checked = state.m2QuizCompleted;

  const handleSelect = (idx: number, optionKey: string) => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2QuizAnswers: {
        ...prev.m2QuizAnswers,
        [`q_${idx}`]: optionKey
      }
    }));
  };

  const isAllAnswered = finalFormativeQuiz.every((_, idx) => answers[`q_${idx}`]);

  const handleCheck = () => {
    onChangeState((prev: LearningState) => ({
      ...prev,
      m2QuizCompleted: true
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>
        Module 2 Quiz
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        This formative quiz helps you review your learning. It does not affect your certificate.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {finalFormativeQuiz.map((item, idx) => {
          const selected = answers[`q_${idx}`];
          return (
            <div key={item.id} style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.25rem', borderRadius: '8px' }}>
              <p style={{ color: 'var(--text-main)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                {idx + 1}. {item.question}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {item.options.map((opt) => (
                  <label key={opt.key} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', cursor: checked ? 'default' : 'pointer' }}>
                    <input
                      type="radio"
                      name={`q_${idx}`}
                      value={opt.key}
                      checked={selected === opt.key}
                      onChange={() => handleSelect(idx, opt.key)}
                      disabled={checked}
                      style={{ cursor: checked ? 'default' : 'pointer' }}
                    />
                    <span>{opt.key}. {opt.text}</span>
                  </label>
                ))}
              </div>

              {checked && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', padding: '0.5rem', borderRadius: '4px', backgroundColor: selected === item.correctKey ? 'rgba(145,200,82,0.1)' : 'rgba(249,115,22,0.1)', color: selected === item.correctKey ? 'var(--color-accent-green)' : 'var(--color-warning)', lineHeight: '1.4' }}>
                  {item.feedback[selected]}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem', paddingBottom: '1rem' }}>
        {!checked ? (
          <button 
            onClick={handleCheck} 
            disabled={!isAllAnswered}
            style={{ backgroundColor: isAllAnswered ? 'var(--color-primary)' : '#cbd5e1', color: 'var(--text-main)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: isAllAnswered ? 'pointer' : 'not-allowed', fontWeight: 600 }}
          >
            Submit Answers
          </button>
        ) : (
          <button 
            onClick={onNext}
            style={{ backgroundColor: 'var(--button-success-bg)', color: 'var(--button-success-text)', border: 'none', padding: '0.6rem 1.75rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700 }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

function SummaryTabsBlock({
  content,
  onNext,
  primaryBg,
  borderCol
}: any) {
  const tabs = content.content.tabs || [];
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <h3 style={{ fontSize: '1.75rem', color: 'var(--text-main)', fontFamily: 'var(--font-family-headings)' }}>{content.title}</h3>
      <p style={{ lineHeight: '1.6' }}>{content.content.paragraphs[0]}</p>

      <div style={{ display: 'flex', borderBottom: `2px solid ${borderCol}`, gap: '0.25rem' }}>
        {tabs.map((tb: any, idx: number) => {
          const active = activeTab === idx;
          return (
            <button
              key={tb.title}
              onClick={() => setActiveTab(idx)}
              style={{
                padding: '0.6rem 1rem',
                backgroundColor: active ? 'rgba(59,153,212,0.15)' : 'transparent',
                border: 'none',
                color: active ? '#fff' : '#cbd5e1',
                borderBottom: active ? '3px solid var(--color-primary)' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.85rem',
                flexGrow: 1
              }}
            >
              {tb.title}
            </button>
          );
        })}
      </div>

      <div style={{ backgroundColor: primaryBg, border: `1px solid ${borderCol}`, padding: '1.5rem', borderRadius: '8px' }}>
        <h4 style={{ color: 'var(--text-main)', fontSize: '1.05rem', marginTop: 0, marginBottom: '0.5rem' }}>{tabs[activeTab]?.title}</h4>
        <p style={{ fontSize: '0.9rem', lineHeight: '1.5', color: 'var(--text-muted)' }}>{tabs[activeTab]?.description}</p>
      </div>

      <button onClick={onNext} className="btn-primary" style={{ alignSelf: 'flex-end', backgroundColor: 'var(--button-primary-bg)', color: 'var(--button-primary-text)', border: 'none', padding: '0.6rem 1.5rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>
        Continue
      </button>
    </div>
  );
}
