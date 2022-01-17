import '@ngx-web3/ui-payment-btn';

export function App() {

  const amount = 0.01;
  return (
    <>
      <p>Price: {amount} BNB</p>
      <ngxweb3-payment-btn
          symbol="BNB"
          chainid="61"
          to="0x..."
          amount="{amount}"></ngxweb3-payment-btn>
      <div />
    </>
  );
}

export default App;
