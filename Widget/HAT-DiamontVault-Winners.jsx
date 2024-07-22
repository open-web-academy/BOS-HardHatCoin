// Contract address for diamond vault
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

// State for current page of pagination
State.init({
  currentPage: 0,
  vaults: [],
  loading: false,
});

// Number of items per page
const itemsPerPage = 5;

// Number of vaults
const number_vaults = Near.view(
  diamondVaultContract,
  "get_vaults_number",
  null,
  null,
  true
);

const period_withdraw = Near.view(
  diamondVaultContract,
  "get_countdown_period_withdraw",
  null,
  null,
  true
);

// Calculate total pages based on vaults array length and items per page
const totalPages = Math.ceil(number_vaults / itemsPerPage);

const getWinnersPaginator = (start_index, limit) => {
  let v = Near.view(
    diamondVaultContract,
    "get_vaults",
    { start_index: start_index, limit: limit },
    null,
    true
  );

  if (!v) {
    setTimeout(() => {
      getWinnersPaginator(start_index, limit);
    }, 500);
  }
  State.update({ vaults: v });
  if (state.vaults.length >= 0) {
    State.update({ loading: true });
  }
};

// Handler for next page button
const handleNextPage = () => {
  if (state.currentPage < totalPages - 1) {
    State.update({ currentPage: state.currentPage + 1 });
    getWinnersPaginator(state.currentPage * 5, itemsPerPage);
  }
};

// Handler for previous page button
const handlePreviousPage = () => {
  if (state.currentPage >= 1) {
    State.update({ currentPage: state.currentPage - 1 });
    getWinnersPaginator(state.currentPage * 5, itemsPerPage);
  }
};

if (!state.loading) {
  getWinnersPaginator(0, itemsPerPage);
} else {
  if (state.vaults.length >= 0) {
    const difference = itemsPerPage - state.vaults.length;
    let elements = state.vaults;
    for (let i = 0; i < difference; i++) {
      elements.push({
        index: -1,
        vault_info: null,
      });
    }
    State.update({ vaults: elements });
  }
}

const convertTimestampToDate = (timestamp) => {
  let timestampInMilliseconds = Math.floor(timestamp / 1000000);
  let date = new Date(timestampInMilliseconds);
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");
  let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

const convertTimestampToDateWithdraw = (timestamp) => {
  let timestampInMilliseconds = Math.floor(
    (timestamp + period_withdraw) / 1000000
  );
  let date = new Date(timestampInMilliseconds);
  let day = String(date.getDate()).padStart(2, "0");
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = date.getFullYear();
  let hours = String(date.getHours()).padStart(2, "0");
  let minutes = String(date.getMinutes()).padStart(2, "0");
  let seconds = String(date.getSeconds()).padStart(2, "0");
  let formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

  return formattedDate;
};

const availableForWithdraw = (endDate) => {
  let endDateToWithdraw = Math.floor((endDate + period_withdraw) / 1000000);

  const dateNow = new Date().getTime();

  if (dateNow > endDateToWithdraw) {
    return true;
  }

  return false;
};

const claimVault = (index) => {
  Near.call([
    {
      contractName: diamondVaultContract,
      methodName: "claim_vault",
      args: { index: index },
      gas: 300000000000000,
      deposit: 1 * 1e22,
    },
  ]);
};

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
       background: white;
       color: black;
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
         width: 100%;
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
     height: 30px;
     border-color: black;
 
     &:hover{
       background: black;
       color: white;
       border-color: #F5AD00;
       border-width: 1.5px;
       border-style: solid;
     }
 `;

const ActiveStatus = styled.div`
     display: inline-flex;
     -webkit-box-align: center;
     align-items: center;
     -webkit-box-pack: center;
     justify-content: center;
     border-radius: 12px !important;
     max-width: 230px;
     background-color: #98FB98;
     padding: 10px;
     font-weight: 500;
     border-color: green;
     border-width: 1.5px;
     border-style: solid;     
     color: black;
     width: 120px;
     height: 45px;
 `;

const ColdDownStatus = styled.div`
     display: inline-flex;
     -webkit-box-align: center;
     align-items: center;
     -webkit-box-pack: center;
     justify-content: center;
     border-radius: 12px !important;
     max-width: 230px;
     background-color: #c6c6c6;
     padding: 10px;
     font-weight: 500;
     border-color: black;
     border-width: 1.5px;
     border-style: solid;     
     color: black;
     width: 120px;
     height: 45px;
 `;

const UnclaimedStatus = styled.div`
     display: inline-flex;
     -webkit-box-align: center;
     align-items: center;
     -webkit-box-pack: center;
     justify-content: center;
     border-radius: 12px !important;
     max-width: 230px;
     background-color: #f8da45;
     padding: 10px;
     font-weight: 500;
     border-color: black;
     border-width: 1.5px;
     border-style: solid;     
     color: black;
     width: 120px;
     height: 45px;
 `;

const ClaimedStatus = styled.div`
     display: inline-flex;
     -webkit-box-align: center;
     align-items: center;
     -webkit-box-pack: center;
     justify-content: center;
     border-radius: 12px !important;
     max-width: 230px;
     background-color: rgb(45, 50, 97);
     padding: 10px;
     font-weight: 500;
     border-color: black;
     border-width: 1.5px;
     border-style: solid;     
     color: white;
     width: 120px;
     height: 45px;
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
.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Estilos generales de la tabla */
.table {
  width: 100%;
  margin-bottom: 1rem;
  background-color: transparent;
}

.table th,
.table td {
  padding: 0.75rem;
  vertical-align: top;
  border-top: 1px solid #dee2e6;
}

.table thead th {
  vertical-align: bottom;
  border-bottom: 2px solid #dee2e6;
}

.table tbody + tbody {
  border-top: 2px solid #dee2e6;
}

.table-sm th,
.table-sm td {
  padding: 0.3rem;
}

/* Estilos para pantallas pequeñas */
@media (max-width: 450px) {
  .table-responsive {
    border: 0;
  }

  .table-responsive .table th,
  .table-responsive .table td {
    white-space: nowrap;
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

// Access the current theme from state
const Theme = state.theme;
// Rendering the main component
return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        <ItemBody>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div className="table-responsive">
              <table className="table table-sm text-center">
                <thead>
                  <tr>
                    <th style={{ width: "17%", textAlign: "center" }}>
                      Finish Date
                    </th>
                    <th style={{ width: "17%", textAlign: "center" }}>
                      Withdraw Date
                    </th>
                    <th style={{ width: "21%", textAlign: "center" }}>
                      Hat's amount
                    </th>
                    <th style={{ width: "25%", textAlign: "center" }}>
                      Vault Winner
                    </th>
                    <th style={{ width: "20%", textAlign: "center" }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {state.vaults.length > 0 &&
                    state.vaults.map((data, key) => (
                      <tr
                        key={key}
                        style={{
                          height: "40px",
                          verticalAlign: "middle",
                          textAlign: "center",
                        }}
                      >
                        <td>
                          {data.vault_info
                            ? convertTimestampToDate(data.vault_info.date_end)
                            : ""}
                        </td>
                        <td>
                          {data.vault_info
                            ? convertTimestampToDateWithdraw(
                                data.vault_info.date_end
                              )
                            : ""}
                        </td>
                        <td>
                          {data.vault_info
                            ? (
                                data.vault_info.token_amount / 1e18
                              ).toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }) + " Hat's"
                            : ""}
                        </td>
                        <td>{data.vault_info ? data.vault_info.winner : ""}</td>
                        <td>
                          {data.vault_info ? (
                            <InputGroup>
                              {availableForWithdraw(
                                data.vault_info.date_end
                              ) ? (
                                !data.vault_info.claimed ? (
                                  data.vault_info.winner ===
                                  context.accountId ? (
                                    <Button
                                      onClick={async () =>
                                        claimVault(data.index)
                                      }
                                    >
                                      Claim
                                    </Button>
                                  ) : (
                                    <UnclaimedStatus>Unclaimed</UnclaimedStatus>
                                  )
                                ) : (
                                  <ClaimedStatus>Claimed</ClaimedStatus>
                                )
                              ) : data.index === number_vaults - 1 &&
                                vaultStatus !== "finish" ? (
                                <ActiveStatus>Active</ActiveStatus>
                              ) : (
                                <ColdDownStatus>
                                  Cold Down Period
                                </ColdDownStatus>
                              )}
                            </InputGroup>
                          ) : (
                            ""
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
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
                {number_vaults > 0
                  ? state.currentPage + 1 + "/" + totalPages
                  : ""}
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
