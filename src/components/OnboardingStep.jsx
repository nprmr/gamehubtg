// components/OnboardingStep.js
import React from "react";

const stepWrapper = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "var(--surface-light)",
    borderRadius: 20,
    padding: 12,
    gap: 12,
};

const numberBlock = {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "var(--surface-main)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Gilroy, sans-serif",
    fontWeight: 700,
    fontSize: 24,
    color: "var(--icotex-white)",
    flexShrink: 0,
};

const textBlock = {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
    gap: 0,
};

const titleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 16,
    fontWeight: 700,
    textAlign: "left",
    color: "var(--icotex-normal)",
    margin: 0,
};

const subtitleStyle = {
    fontFamily: "Gilroy, sans-serif",
    fontSize: 14,
    fontWeight: 400,
    color: "var(--icotex-lowest)",
    margin: 0,
};

function OnboardingStep({ number, title, subtitle }) {
    return (
        <div style={stepWrapper}>
            <div style={numberBlock}>{number}</div>
            <div style={textBlock}>
                <p style={titleStyle}>{title}</p>
                <p style={subtitleStyle}>{subtitle}</p>
            </div>
        </div>
    );
}

export default OnboardingStep;
