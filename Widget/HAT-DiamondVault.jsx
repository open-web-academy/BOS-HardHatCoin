// Address of the auction contract on the NEAR blockchain
const diamondVaultContract = "diamondvault.hat-coin.near";
// Address of the fungible token contract on the NEAR blockchain
const ftContract = "hat.tkn.near";

// State variables to manage the date and time of the auction, the current bid, the current bidder, the auction status, the new bid, and the validity of the bid
const [date, setDate] = useState(null);
const [startTime, setStartTime] = useState(new Date().getTime());
const [endTime, setEndTime] = useState(0);
const [days, setDays] = useState("-");
const [hours, setHours] = useState("-");
const [minutes, setMinutes] = useState("-");
const [seconds, setSeconds] = useState("-");
const [vaultStatus, setVaultStatus] = useState("");
const [amountTokens, setAmountTokens] = useState(0);
const [validInput, setValidInput] = useState(true);
const [validInputAmount, setValidInputAmount] = useState(10000);
const [validInputInteger, setValidInputInteger] = useState(true);
const [showModal, setShowModal] = useState(false);

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

const lastDeposit = Near.view(
  diamondVaultContract,
  "get_last_deposit",
  null,
  null,
  true
);

// Update auction state based on data obtained from contract methods
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
    setValidInputAmount(10000);
  } else {
    diff = 0;
    setVaultStatus("finish");
    setValidInputAmount(100000);
  }

  let days = Math.floor(diff / (1000 * 60 * 60 * 24));
  let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  let seconds = Math.floor((diff % (1000 * 60)) / 1000);

  setDays(days);
  setHours(hours);
  setMinutes(minutes);
  setSeconds(seconds);

  clearInterval(timer);
}, 1000);

const sendHats = () => {
  console.log("vaultStatus: " + vaultStatus);
  console.log("amountTokens: " + amountTokens);

  if (amountTokens % 1 !== 0) {
    setValidInput(false);
    setValidInputInteger(false);
    return;
  }

  setValidInputInteger(true);

  if (vaultStatus == "finish" && amountTokens < 100000) {
    setValidInput(false);
    setValidInputAmount(100000);
    return;
  }

  if (amountTokens >= 10000) {
    setValidInput(true);
    Near.call(
      ftContract,
      "ft_transfer_call",
      {
        receiver_id: diamondVaultContract,
        amount: amountTokens.toString() + "000000000000000000",
        msg: '{"action_to_execute": "increase_deposit"}',
      },
      300000000000000,
      1
    );
  } else {
    setValidInput(false);
    setValidInputAmount(10000);
    return;
  }
};

const openModal = () => {
  setShowModal(true);
};

const closeModal = () => {
  setShowModal(false);
};

// Definition of styled components using styled-components
const Timer = styled.div`
  .time {
    font-size: 48px;
    font-weight: 800;
    color: white;
    width: 100px;
    line-height: 1;
  }
  small {
    margin-bottom: 0;
    align-items: center;
  }
`;

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
        height: 500px;
        padding: 0px 32px;
        position: relative;
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
        height: 500px;
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
      background: white;
      color: black;
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
    background: black;
    color: white;
    cursor: default !important;
`;

const CircleButton = styled.button`
     display: inline-flex;
     align-items: center;
     justify-content: center;
     border-radius: 100%;
     background-color: #00B4D8;
     font-weight: 500;
     border: 0px;
     color: white;
     width: 20px;
     height: 20px;
     margin-left: 5px;
     margin-top: 10px;
     font-size: 20px;
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
.timerNumbers{
    font-size: 48px;
}

.timerTitle{
      font-size: 23px;
}

@media only screen and (max-width: 450px) {
.timerNumbers{
    font-size: 20px;
}

.timerTitle{
      font-size: 10px;
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

// TimerContent component that displays the countdown
const TimerContent = () => {
  const TimeSlot = ({ time, title }) => (
    <div className={"text-center"}>
      <div className="time timerNumbers">{formatTime(time)}</div>
      <small className="timerTitle">{title}</small>
    </div>
  );

  return (
    <>
      <Timer className="d-flex">
        <TimeSlot title="Days" time={days} />
        <TimeSlot title="Hours" time={hours} />
        <TimeSlot title="Minutes" time={minutes} />
        <TimeSlot title="Seconds" time={seconds} />
      </Timer>
    </>
  );
};

// Rendering the main component where necessary methods are called to interact with the smart contract
return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        {showModal && (
          <Widget
            props={{
              closeModal,
            }}
            src={"owa-is-bos.near/widget/HAT-DiamondVault-Modal"}
          />
        )}
        <ItemBody>
          <div class="row" style={{ color: "white" }}>
            <div class="col-6" style={{ alignContent: "center" }}>
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "center", fontSize: "25px" }}>
                    <img
                      style={{ height: "63px" }}
                      src="https://raw.githubusercontent.com/open-web-academy/BOS-HardHatCoin/main/assets/tools.png"
                    />{" "}
                    <br />
                    <label
                      style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {vaultStatus !== "finish"
                        ? lastVault[1].winner &&
                          lastVault[1].winner.endsWith(".testnet") &&
                          lastVault[1].winner.length < 17
                          ? lastVault[1].winner
                          : lastVault[1].winner.length > 17
                          ? lastVault[1].winner.substring(0, 17) + "..."
                          : lastVault[1].winner
                        : "-"}
                    </label>
                    <br />
                    <label
                      style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Last Contributor
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6" style={{ alignContent: "center" }}>
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "center", fontSize: "25px" }}>
                    <img
                      style={{ height: "63px" }}
                      src="https://raw.githubusercontent.com/open-web-academy/BOS-HardHatCoin/main/assets/gold.png"
                    />{" "}
                    <br />
                    <label
                      style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        textDecoration: "underline",
                      }}
                    >
                      {vaultStatus !== "finish"
                        ? lastDeposit && Math.ceil(lastDeposit.ft_amount / 1e18)
                        : 0}{" "}
                      HAT's
                    </label>
                    <br />
                    <label
                      style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        fontSize: "17px",
                      }}
                    >
                      Last Deposit
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="col-12"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                style={{
                  height: "100%",
                  textAlign: "center",
                  marginTop: "30px",
                  fontWeight: "bold",
                  fontSize: "25px",
                }}
              >
                <label style={{ marginBottom: "10px" }}>Vault ends</label>
                <TimerContent />
              </div>
            </div>

            <div class="col-12">
              {vaultStatus != "" && (
                <>
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      "justify-content": "center",
                      "align-items": "center",
                      marginTop: "30px",
                    }}
                  >
                    {context.accountId ? (
                      <InputGroup>
                        <>
                          <Input
                            type="number"
                            min={1}
                            step="1"
                            placeholder={validInputAmount + " or more Hat's"}
                            onChange={(e) => setAmountTokens(e.target.value)}
                          />
                          <Button onClick={sendHats}>Send</Button>
                          <CircleButton onClick={() => openModal()}>
                            ⓘ
                          </CircleButton>
                        </>
                      </InputGroup>
                    ) : (
                      <InputGroup>
                        <ButtonDisabled>Login to deposit</ButtonDisabled>
                      </InputGroup>
                    )}
                  </div>
                </>
              )}
            </div>
            {context.accountId && (
              <div class="col-12">
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    marginTop: "15px",
                  }}
                >
                  <div>
                    <span style={{ textDecoration: "underline" }}>
                      1% fee for OWA
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div class="col-12">
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center",
                  marginTop: "15px",
                }}
              >
                <br />
                {!validInput &&
                  (vaultStatus == "finish" ? (
                    <label>
                      {validInputInteger
                        ? "The deposit to start a new vault must be a minimum of 100,000 $HAT"
                        : "The amount of $HAT must be an integer"}
                    </label>
                  ) : (
                    <label>
                      {validInputInteger
                        ? "Deposit must be a minimum of 10,000 $HAT"
                        : "The amount of $HAT must be an integer"}
                    </label>
                  ))}
              </div>
            </div>
          </div>
        </ItemBody>
      </ItemContainer>
    </ItemBackground>
  </Theme>
);
