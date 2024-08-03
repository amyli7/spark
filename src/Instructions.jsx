import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export const Instructions = ({ show, onClose }) => (
  <div
    className={`fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex items-center justify-center ${show ? 'block' : 'hidden'}`}
    style={{ zIndex: 1000 }}
  >
    <div className="bg-purple-900 p-6 rounded-lg max-w-lg mx-auto relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 w-8 h-8 bg-dark-purple text-white rounded-full flex items-center justify-center text-xl font-semibold hover:bg-purple-600 focus:outline-none"
      >
        &times;
      </button>
      <h2 className="text-xl font-bold mb-4 text-white">Instructions</h2>
      <ul className="list-disc list-inside space-y-2 text-white">
        <li>Click on the canvas to add a new point.</li>
        <li>Click on an existing point to select it.</li>
        <li>Drag selected point to move it.</li>
        <li>Click on selected point again to set theta.</li>
        <li>Press 'd' to delete the last point.</li>
        <li>Press 'e' to deselect any selected point.</li>
      </ul>
    </div>
  </div>
);

export const InstructionIcon = ({ toggleInstructions }) => (
  <div
    onClick={toggleInstructions}
    className="instructions-button"
  >
    <FontAwesomeIcon icon={faInfoCircle} size="lg" />
  </div>
);
