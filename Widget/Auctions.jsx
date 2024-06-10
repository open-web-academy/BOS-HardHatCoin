const [date, setDate] = useState(null);
const [startTime, setStartTime] = useState(0);
const [endTime, setEndTime] = useState(0);
const [days, setDays] = useState("-");
const [hours, setHours] = useState("-");
const [minutes, setMinutes] = useState("-");
const [seconds, setSeconds] = useState("-");
const [currentBid, setCurrentBid] = useState(0);
const [currentBidder, setCurrentBidder] = useState(0);
const [auctionStatus, setAuctionStatus] = useState("");
const [newBid, setNewBit] = useState(0);
const [minBid, setMinBit] = useState(0);
const [validBit, setValidBit] = useState(true);

const tokensPerAuction = Near.view(
  "auctionshat.testnet",
  "get_tokens_per_auction",
  null,
  null,
  true
);

const currentSupply = Near.view(
  "auctionshat.testnet",
  "get_current_supply",
  null,
  null,
  true
);

const auction = Near.view(
  "auctionshat.testnet",
  "get_auction_info",
  null,
  null,
  true
);

if (tokensPerAuction && currentSupply && auction) {
  setMinBit(auction.highest_bid / 1e24 + 0.5);
  setStartTime(auction.start_time.toString().substring(0, 13));
  setEndTime(auction.end_time.toString().substring(0, 13));
  setCurrentBid(auction.highest_bid / 1e24);
  setCurrentBidder(auction.highest_bidder);
}

const formatTime = (time) => (time < 10 ? `0${time}` : time);

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
    setAuctionStatus("active");
  } else {
    diff = 0;
    setAuctionStatus("finish");
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

const TimerContent = () => {
  const TimeSlot = ({ time, title }) => (
    <div className={"text-center"}>
      <div className="time">{formatTime(time)}</div>
      <small>{title}</small>
    </div>
  );

  return (
    <>
      <Timer className="d-flex">
        <TimeSlot title="hours" time={hours} />
        <TimeSlot title="minutes" time={minutes} />
        <TimeSlot title="seconds" time={seconds} />
      </Timer>
    </>
  );
};

const addBid = () => {
  console.log("auctionStatus: " + auctionStatus);
  if (auctionStatus == "active") {
    if (newBid >= currentBid + 0.1) {
      setValidBit(true);
      Near.call(
        "auctionshat.testnet",
        "start_or_place_bid",
        {},
        "300000000000000",
        newBid * 1e24 + 1
      );
    } else {
      setMinBit(currentBid + 0.1);
      setValidBit(false);
      console.log("Bid must be >= " + currentBid + 0.1);
    }
  }
  if (auctionStatus == "finish") {
    if (newBid >= 0.1) {
      setValidBit(true);
      Near.call(
        "auctionshat.testnet",
        "start_or_place_bid",
        {},
        "300000000000000",
        newBid * 1e24 + 1
      );
    } else {
      setMinBit(0.1);
      setValidBit(false);
      console.log("Bid must be >= " + 0.1);
    }
  }
};

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
        font-weight: 400;
        font-size: 1em;
        line-height: 1.6em;
        border-radius: 0px 0px 20px 20px;
        margin: -20px 0px 0px;
        padding: 32px;
        box-shadow: none;
        color: black;
        background: rgb(45, 50, 97);
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
const cssFont = fetch(
  "https://fonts.googleapis.com/css2?family=Lexend:wght@200;300;400;500;600;700;800"
).body;
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

// Finally we render the component where we call the necessary methods to interact with the smart contract.
return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        <ItemHeader>
          <ItemTitle>
            <label>Current Supply: {currentSupply} HAT's</label>
          </ItemTitle>
        </ItemHeader>
        <ItemBody>
          <div class="row" style={{ color: "white" }}>
            <div class="col-12" style={{ alignContent: "center" }}>
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "right", fontSize: "25px" }}>
                    <label>{date}</label>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-6">
              <div
                style={{
                  height: "100%",
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center",
                }}
              >
                <img
                  src="https://raw.githubusercontent.com/open-web-academy/BOS-HardHatCoin/main/assets/icon.png"
                  style={{
                    height: "150px",
                  }}
                ></img>
              </div>
            </div>
            <div class="col-6" style={{ alignContent: "center" }}>
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "center", fontSize: "25px" }}>
                    <label style={{ fontWeight: "bold" }}>
                      Auctioned tokens
                    </label>
                    <br />
                    <label style={{ marginTop: "10px" }}>
                      {tokensPerAuction} HAT's
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-6"
              style={{ alignContent: "center", marginTop: "10px" }}
            >
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "center", fontSize: "20px" }}>
                    <label style={{ fontWeight: "bold" }}>
                      {auctionStatus == "finish" ? "Winner" : "Current bidder"}
                    </label>
                    <br />
                    <label style={{ marginTop: "10px" }}>{currentBidder}</label>
                  </div>
                </div>
              </div>
            </div>

            <div
              class="col-6"
              style={{ alignContent: "center", marginTop: "10px" }}
            >
              <div class="row">
                <div class="col-12">
                  <div style={{ textAlign: "center", fontSize: "20px" }}>
                    <label style={{ fontWeight: "bold" }}>
                      {auctionStatus == "finish"
                        ? "Winning bid"
                        : "Current bid"}
                    </label>
                    <br />
                    <label style={{ marginTop: "10px" }}>
                      {currentBid.toFixed(2)} NEAR
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {auctionStatus == "active" && (
              <div class="col-12">
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    "justify-content": "center",
                    "align-items": "center",
                    marginTop: "30px",
                  }}
                >
                  Auction ends in
                  <TimerContent />
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
                  marginTop: "30px",
                }}
              >
                {currentSupply < tokensPerAuction ? (
                  <InputGroup>
                    <ButtonDisabled>
                      There are no hats left for auction
                    </ButtonDisabled>
                  </InputGroup>
                ) : context.accountId ? (
                  <InputGroup>
                    {auctionStatus == "active" ? (
                      <Input
                        type="number"
                        min={minBid.toFixed(1)}
                        step="0.5"
                        placeholder={minBid.toFixed(1) + "⋈ or more"}
                        onChange={(e) => setNewBit(e.target.value)}
                      />
                    ) : (
                      <Input
                        type="number"
                        min="2"
                        step="0.5"
                        placeholder="2 ⋈ or more"
                        onChange={(e) => {
                          setNewBit(e.target.value);
                          setValidBit(true);
                        }}
                      />
                    )}
                    <Button onClick={addBid}>
                      <i className="bi bi-coin mx-1"></i> Place bid
                    </Button>
                  </InputGroup>
                ) : (
                  <InputGroup>
                    <ButtonDisabled>Please login to bid</ButtonDisabled>
                  </InputGroup>
                )}
              </div>
            </div>

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
                {!validBit && (
                  <label>The bid must be equal or greater than {minBid}</label>
                )}
              </div>
            </div>
          </div>
        </ItemBody>
      </ItemContainer>
    </ItemBackground>
  </Theme>
);