const closeModal = props.closeModal;

const diamondVaultContract = "diamondvault.hat-coin.near";

const period_withdraw = Near.view(
  diamondVaultContract,
  "get_countdown_period_withdraw",
  null,
  null,
  false
);

const cssFont = `
.container{
      width: 450px;
      padding: 22px;
      background: black;
      color: white;
      margin: auto;
      position: absolute;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      max-width: 600px;
      height: 450px;
      border: 1px solid rgba(255,255,255);
      border-radius: 20px;
      right: 0;
      left: 0;
      z-index: 100;
}

@media only screen and (max-width: 450px) {
.container{
    width: 380px;
    height: 500px;
}
}
`;

const css = fetch(
  "https://nativonft.mypinata.cloud/ipfs/QmQNCGVCwmkPxcKqDdubvb8Goy5xP8md2MfWCAix7HxgGE"
).body;

if (!cssFont || !css) return "";

if (!state.theme) {
  State.update({
    theme: styled.div`
    font-family: Lexend;
    ${cssFont}
    ${css}
`,
  });
}

const Theme = state.theme;

return (
  <Theme>
    <div className="container">
      <div style={{ color: "rgb(255, 255, 255)" }}>
        <div
          style={{
            minWidth: "320px",
            borderRadius: "8px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            placeContent: "space-between flex-start",
          }}
        >
          <div style={{ float: "right", right: "16px", position: "absolute" }}>
            <button
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                boxSizing: "border-box",
                backgroundColor: "transparent",
                outline: "0px",
                border: "0px",
                cursor: "pointer",
                userSelect: "none",
                verticalAlign: "middle",
                appearance: "none",
                textDecoration: "none",
                textAlign: "center",
                flex: "0 0 auto",
                fontSize: "1.5rem",
                padding: "8px",
                borderRadius: "50%",
                overflow: "visible",
                transition:
                  "background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
                color: "white",
                margin: "-8px",
              }}
              onClick={async () => {
                closeModal();
              }}
            >
              x
            </button>
          </div>
        </div>
        <div style={{ marginBottom: "10px" }}>
          <span>
            The following table shows the new count down period to finish the
            vault depending on the $HAT deposit:
          </span>
        </div>
        <table className="table table-sm text-center">
          <thead>
            <tr>
              <th style={{ width: "10%" }}>Deposit</th>
              <th style={{ width: "45%" }}>$HAT's</th>
              <th style={{ width: "45%" }}>Count Down Period</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ height: "40px", verticalAlign: "middle" }}>
              <td>{"<="}</td>
              <td>{"500,000"}</td>
              <td>Without changes</td>
            </tr>
            <tr style={{ height: "40px", verticalAlign: "middle" }}>
              <td>{"<="}</td>
              <td>{"1,000,000"}</td>
              <td>1 Day</td>
            </tr>
            <tr style={{ height: "40px", verticalAlign: "middle" }}>
              <td>{"<="}</td>
              <td>{"5,000,000"}</td>
              <td>12 Hours</td>
            </tr>
            <tr style={{ height: "40px", verticalAlign: "middle" }}>
              <td>{"<"}</td>
              <td>{"20,000,000"}</td>
              <td>1 Hour</td>
            </tr>
            <tr style={{ height: "40px", verticalAlign: "middle" }}>
              <td>{">="}</td>
              <td>{"20,000,000"}</td>
              <td>15 Minutes</td>
            </tr>
          </tbody>
        </table>
        <div>
          <span>
            You need to wait {period_withdraw / 86400000000000} days from the
            vault end date to be able to withdraw the tokens.
          </span>
        </div>
      </div>
    </div>
  </Theme>
);
