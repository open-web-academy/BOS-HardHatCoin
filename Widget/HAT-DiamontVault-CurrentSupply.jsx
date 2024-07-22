const diamondVaultContract = "diamondvault.hat-coin.near";

const [date, setDate] = useState(null);
const [startTime, setStartTime] = useState(new Date().getTime());
const [endTime, setEndTime] = useState(0);
const [vaultStatus, setVaultStatus] = useState("");

const countdownPeriod = Near.view(
  diamondVaultContract,
  "get_countdown_period",
  null,
  null,
  true
);

const lastVault = Near.view(
  diamondVaultContract,
  "get_last_vault",
  null,
  null,
  true
);

if (countdownPeriod) {
  setEndTime(Math.floor(countdownPeriod / 1000000));
}

// Function to format the time, adding a leading zero if necessary
const formatTime = (time) => (time < 10 ? `0${time}` : time);

// Timer that updates the countdown every second
const timer = setInterval(() => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const date = new Date();
  setDate(date.toLocaleDateString("en-US", options));

  const now = date.getTime();
  const start = new Date(parseInt(startTime)).getTime();
  const end = new Date(parseInt(endTime)).getTime();

  let diff;
  if (now < start) {
    diff = new Date(parseInt(start)).getTime() - new Date().getTime();
  } else if (now > start && now < end) {
    diff = new Date(parseInt(end)).getTime() - new Date().getTime();
    setVaultStatus("active");
  } else {
    diff = 0;
    setVaultStatus("finish");
  }

  clearInterval(timer);
}, 1000);

// Definition of various styled components to structure and style the auction user interface
const Wrapper = styled.div`
* {
  font-family: 'system-ui','Inter', 'Space Grotesk' !important;
}
`;

const ItemBackground = styled.div`
        width: 100%;
        display: flex;
        justify-content: center;
        background-repeat: no-repeat;
        background-size: cover;
        margin-bottom: -50px;
        `;

const ItemContainer = styled.div`
        margin-top: 30px;
        box-sizing: border-box;
        min-width: 375px;
        width: 700px;
        height: 450px;
        padding: 0px 32px;
        position: relative;
        display: grid;
        justify-items: center;
        `;

const ItemTitle = styled.h3`
        text-align: center;
        color: black;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 1rem;
        `;

const ItemImage = styled.img`
            width: 40px;
            margin-right: 15px;
        `;

const ItemSubTitle = styled.div`
        text-align: center;
        color: yellow;
        margin-bottom: 5px;
        `;

const ItemHeader = styled.div`
        width: 80%;
        z-index: 1;
        background: #F5AD00;
        color: #1E1E1E;
        font-weight: 400;
        font-size: 12px;
        line-height: 1.6em;
        border-radius: 20px;
        margin: 0px;
        padding: 20px;
        box-shadow: none;
        color: rgb(255, 255, 255);
        `;

const ItemBody = styled.div`
        font-weight: 400;
        font-size: 1em;
        line-height: 1.6em;
        border-radius: 20px 20px 20px 20px;
        margin: -20px 0px 0px;
        padding: 32px;
        box-shadow: none;
        color: black;
        background: black;
        `;

const InputGroup = styled.div`
    position: relative;
    display: flex;
    flex-wrap: wrap;
    -webkit-box-align: stretch;
    align-items: center;
    width: 100%;
    justify-content: center;
`;

const Button = styled.button`
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-radius: 12px !important;
    max-width: 230px;
    background-color: #F5AD00;
    padding: 10px;
    font-weight: 500;
    border: 0px;
    color: black;
    width: 120px;
    height: 54px;
    margin-left: 5px;
    margin-top: 10px;

    &:hover{
      background: rgb(45, 50, 97);
      color: white;
      border-color: #F5AD00;
      border-width: 1.5px;
      border-style: solid;
    }
`;

const ButtonDisabled = styled.button`
    display: inline-flex;
    -webkit-box-align: center;
    align-items: center;
    -webkit-box-pack: center;
    justify-content: center;
    border-radius: 12px !important;
    max-width: 230px;
    padding: 10px;
    font-weight: 500;
    border: 0px;
    width: 120px;
    height: 54px;
    margin-left: 5px;
    margin-top: 10px;
    background: rgb(45, 50, 97);
    color: white;
    cursor: default !important;
`;

const Input = styled.input`
    -webkit-box-sizing: border-box;
    height: 54px;
    color: #000;
    border-radius: 12px !important;
    box-shadow: inset 0 0 0 1px #fff;
    background-color: #fff;
    outline: none !important;
    box-shadow: none !important;
    font-family: "PT Root UI";
    font-weight: 700;
    font-size: 25px;
    transition: all .2s ease-in-out;
    border: none;
    margin-right: 5px;
    text-align: center;
    margin-top: 10px;
`;

// FETCH CSS
const cssFont = `
.vaultImg{
  height: 250px;
}

@media only screen and (max-width: 450px) {
.vaultImg{
  height: 150px;
}}
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

// Rendering the main component where necessary methods are called to interact with the smart contract
return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        <ItemBody>
          <div class="row" style={{ color: "white" }}>
            <div class="col-12">
              <ItemTitle>
                <label style={{ color: "white", fontSize: "50px" }}>
                  {vaultStatus && vaultStatus !== "finish"
                    ? (lastVault[1].token_amount / 1e18).toLocaleString(
                        "en-US",
                        { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                      )
                    : 0}{" "}
                  $HAT
                </label>
              </ItemTitle>
              <ItemTitle>
                <label style={{ color: "white", fontSize: "30px" }}>
                  Current Vault
                </label>
              </ItemTitle>
            </div>
            <div class="col-12">
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center",
                }}
              >
                <img
                  src="https://raw.githubusercontent.com/open-web-academy/BOS-HardHatCoin/main/assets/vault.png"
                  className="vaultImg"
                ></img>
              </div>
            </div>
          </div>
        </ItemBody>
      </ItemContainer>
    </ItemBackground>
  </Theme>
);
