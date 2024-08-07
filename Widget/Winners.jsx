// Contract address for auctions
const auctionsContract = "auctions.hat-coin.near";

// State for current page of pagination
State.init({
  currentPage: 0,
  winners: [],
  loading: false,
});

// Number of items per page
const itemsPerPage = 5;

// Number of winners
const number_winners = Near.view(
  auctionsContract,
  "get_winners_number",
  null,
  null,
  true
);

// Calculate total pages based on winners array length and items per page
const totalPages = Math.ceil(number_winners / itemsPerPage);

const getWinnersPaginator = (page, size) => {
  console.log("page: " + page);
  console.log("size: " + size);
  let w = Near.view(
    auctionsContract,
    "get_winners_pagination",
    { page: page, page_size: size },
    null,
    true
  );

  if (!w) {
    setTimeout(() => {
      getWinnersPaginator(page, size);
    }, 500);
  }
  State.update({ winners: w });
  if (state.winners.length > 0) {
    State.update({ loading: true });
  }
};

// Handler for next page button
const handleNextPage = () => {
  if (state.currentPage < totalPages - 1) {
    State.update({ currentPage: state.currentPage + 1 });
    getWinnersPaginator(state.currentPage, 5);
  }
};

// Handler for previous page button
const handlePreviousPage = () => {
  if (state.currentPage >= 1) {
    State.update({ currentPage: state.currentPage - 1 });
    getWinnersPaginator(state.currentPage, 5);
  }
};

if (!state.loading) {
  getWinnersPaginator(0, 5);
} else {
  if (state.winners.length > 0) {
    console.log(2);
    const difference = itemsPerPage - state.winners.length;
    let elements = state.winners;
    for (let i = 0; i < difference; i++) {
      elements.push({
        account: "",
        bid: 0,
        hat_amount: 0,
      });
    }
    State.update({ winners: elements });
  }
}

// Styled components for UI elements
const Wrapper = styled.div`
 * {
   font-family: 'system-ui','Inter', 'Space Grotesk' !important;
 }
 `;

const CircleButton = styled.button`
     display: inline-flex;
     -webkit-box-align: center;
     align-items: center;
     -webkit-box-pack: center;
     justify-content: center;
     border-radius: 50%;
     background-color: #F5AD00;
     padding: 10px;
     font-weight: 500;
     border: 0px;
     color: black;
     width: 50px;
     height: 50px;
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

// Access the current theme from state
const Theme = state.theme;

// Rendering the main component
return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        <ItemHeader>
          <ItemTitle>
            <label>Winners who have claimed their $HATs</label>
          </ItemTitle>
        </ItemHeader>
        <ItemBody>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <table className="table table-sm">
              <thead>
                <tr>
                  <th style={{ width: "40%" }}>Account</th>
                  <th style={{ width: "30%" }}>Winner Bid</th>
                  <th style={{ width: "30%" }}>Hats Obtained</th>
                </tr>
              </thead>
              <tbody>
                {state.winners.length > 0 &&
                  state.winners.map((data, key) => {
                    return (
                      <>
                        <tr style={{ height: "40px" }}>
                          <td>{data.account ? data.account : ""}</td>
                          <td>
                            {data.bid ? (data.bid / 1e24).toFixed(1) + "⋈" : ""}
                          </td>
                          <td>{data.hat_amount ? data.hat_amount : " "}</td>
                        </tr>
                      </>
                    );
                  })}
              </tbody>
            </table>
          </div>
          {true && (
            <div
              className="row"
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div
                className="col-4"
                style={{ display: "flex", "justify-content": "start" }}
              >
                <CircleButton onClick={handlePreviousPage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
                  </svg>
                </CircleButton>
              </div>
              <div
                className="col-2"
                style={{
                  display: "flex",
                  "justify-content": "center",
                  "align-items": "center",
                  color: "white",
                  "font-size": "19px",
                }}
              >
                {state.currentPage + 1}/{totalPages}
              </div>
              <div
                className="col-4"
                style={{ display: "flex", "justify-content": "end" }}
              >
                <CircleButton onClick={handleNextPage}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 11.996z" />
                  </svg>
                </CircleButton>
              </div>
            </div>
          )}
        </ItemBody>
      </ItemContainer>
    </ItemBackground>
  </Theme>
);
