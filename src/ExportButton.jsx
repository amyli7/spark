import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export const ExportButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="export-button"
  >
    <FontAwesomeIcon icon={faArrowRight} size="lg" />
  </button>
);
