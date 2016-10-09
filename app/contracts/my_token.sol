
contract MyToken {
    /* Public variables of the token */
    uint256 public usdGbpExcRate;
    uint256 public initialUSDSupply;
    uint256 public initialGBPSupply;

    mapping (address => uint256) public balanceOfUSD;
    mapping (address => uint256) public balanceOfGBP;

    /* This generates a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /* Initializes contract with initial supply tokens to the creator of the contract */
    function MyToken(
        uint256 excRate,
        uint256 usdSupply,
        uint256 gbpSupply
        ) {
        balanceOfUSD[msg.sender] = usdSupply;
        initialUSDSupply = usdSupply;
        initialGBPSupply = gbpSupply;
        balanceOfGBP[msg.sender] = gbpSupply;
        usdGbpExcRate = excRate;
    }

    function transferUSD(address _from, address _to, uint256 _value) {
      if (balanceOfUSD[_from] < _value) throw;
      uint256 gbp = _value*usdGbpExcRate/100;
      if (balanceOfGBP[_to] + gbp < balanceOfGBP[_to]) throw;
      balanceOfUSD[_from] -= _value;
      balanceOfGBP[_to] += gbp;
      Transfer(_from, _to, _value);
    }

    function transferGBP(address _from, address _to, uint256 _value) {
         if (balanceOfGBP[_from] < _value) throw;
         uint256 usd = _value*100/usdGbpExcRate;
         if (balanceOfUSD[_to] + usd < balanceOfUSD[_to]) throw;
         balanceOfGBP[_from] -= _value;
         balanceOfUSD[_to] += usd;
         Transfer(_from, _to, _value);
    }

    /* This unnamed function is called whenever someone tries to send ether to it */
    function () {
        throw;
    }
}