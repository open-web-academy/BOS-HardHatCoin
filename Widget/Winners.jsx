const auctionsContract = "auctionshat1.testnet";
const winners = Near.view(auctionsContract, "get_winners", null, null, true);

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

return (
  <Theme>
    <ItemBackground>
      <ItemContainer>
        <ItemHeader>
          <ItemTitle>
            <label>List Of Winners</label>
          </ItemTitle>
        </ItemHeader>
        <ItemBody>
          <table className="table table-hover table-sm">
            <thead>
              <tr>
                <th>Account</th>
                <th>Winner Bid</th>
                <th>Hats Obtained</th>
              </tr>
            </thead>
            <tbody>
              {winners.map((data, key) => {
                return (
                  <>
                    <tr>
                      <td>{data.account}</td>
                      <td>{data.bid / 1e24}⋈</td>
                      <td>{data.hat_amount}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </ItemBody>
      </ItemContainer>
    </ItemBackground>
  </Theme>
);

