import '@ngx-web3/ui-payment-btn';

export function App() {
  const chainid = '61';
  const amount = 250;
  return (
    <>
      <p>Price: $ {amount} USD</p>
      <ngxweb3-payment-btn
          chainid={chainid}
          symbol="BNB"
          to="Ox..."
          display-error={true}
          amount={amount}></ngxweb3-payment-btn>
      <div />
    </>
  );
}

export default App;
