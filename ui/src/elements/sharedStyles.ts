import { css } from 'lit-element';

export const sharedStyles = css`
  .row {
    display: flex;
    flex-direction: row;
  }

  .column {
    display: flex;
    flex-direction: column;
  }

  .center-content {
    justify-content: center;
    align-items: center;
  }

  .padding {
    padding: 24px;
  }

  .shell-container {
    display: flex;
    flex: 1;
  }

  .fill {
    flex: 1;
  }

  mwc-card {
    width: auto;
  }

  .title {
    font-weight: bold;
    font-size: 18px;
  }

  .background {
    z-index: 0;
    opacity: 0.5;
    position: fixed;
    height: 100vh;
    width: 100vw;
    background-image: url(/assets/background.jpg);
    background-image: url(/background.jpg);
  }
`;
