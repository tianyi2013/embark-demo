$(document).ready(function() {

  var displayBalance = function (accounts, selector) {
    $(selector).nextAll().empty();
    $.each(accounts, function (index, account){
        var etherBalance = web3.eth.getBalance(account)/1000000000000000000, // by default getBalance return wei
            usdBalance = MyToken.balanceOfUSD(account).toNumber(),
            gbpBalance = MyToken.balanceOfGBP(account).toNumber(),
            html = "<tr><td>"+account+"</td>"
                    +"<td>"+usdBalance+"</td>"
                    +"<td>"+gbpBalance+"</td>"
                    +"<td>"+etherBalance+"</td></tr>";
        $(selector).after(html);
    });
  }

  var addToLog = function(txt) {
    var html = "<tr><td>" + new Date()+"</td>" + "<td>"+txt+"</td>";
    $(".logs").after(html);
  }

  var init = function() {
    var accounts = web3.eth.accounts,
        options = [];
    $("span.exc-rate").text(" "+MyToken.usdGbpExcRate()/100);
    $("span.usd-total-supply").text(" "+MyToken.initialUSDSupply());
    $("span.gbp-total-supply").text(" "+MyToken.initialGBPSupply());

    displayBalance(accounts, ".account-summary");

    $.each(accounts, function(index, account){
        options.push("<option>"+account+"</option>");
    });

    $(".from-address").append(options);
    $(".to-address").append(options);

  }

  $("button.transfer").click(function() {
      var volume = parseInt($("input.volume").val(), 10),
          to_address = $("select.to-address").val(),
          from_address = $("select.from-address").val();
      if (isNaN(volume) || volume<=0) {
        alert("Volume must be a positive number");
      }else{
        if ($(".currency").val()==='usd'){
            MyToken.transferUSD(from_address, to_address, volume);
            addToLog("transfer "+volume+" US dollars from "+from_address+" to "+to_address);
        }else{
            MyToken.transferGBP(from_address, to_address, volume);
            addToLog("transfer "+volume+" British pounds from "+from_address+" to "+to_address);
        }
      }
      displayBalance(web3.eth.accounts, ".account-summary");
    });

  $("button.refresh").click(function(){
    displayBalance(web3.eth.accounts, ".account-summary");
  });

  $("button.cancel").click(function(){
    $(".transfer-form").trigger('reset');
  })

  // initialise page
  init();

});
