$(document).ready(function() {
    
    var title = $("#wallet-title");
    userEmail();

    $("#close").on("click", function () {
        window.location.href = "/members";
      });

    $.get("/api/user_data").then(data => {
        ownerId =(data.id);
      });
    
    $("#cat-btn").click(function(e){
        e.preventDefault();
        catInput = $("input#wallet-cat").val().trim();
        var catli =$("<li id='cat'>");
        catli.text(catInput);
        $("#cat-list").append(catli);
        $("input#wallet-cat").val("")
    })
    var category = $("li#cat").text()  

    if($('#radio_button').is(':checked'))



var emailArr =[];
function userEmail(){
  $("#user-btn").click(function(e){
    e.preventDefault();
    emailInput = $("input#user-email").val();
    emailArr.push(emailInput)
    
    var list = "";
    for(var i=0; i < emailArr.length; i++){
      list +="<li>"+emailArr[i]+"</li>";
      }
    $("#user-list").append(list);
    $("input#user-email").val("")
  })
}

  $("#walletsub-btn").on("click", function (event) {
    event.preventDefault();
      createWallet();
      window.location.href = "members.html";
    })

function createWallet() {
    var wallet = {
        title: title.val().trim(),
        category: category,
        public:  $('#exampleRadios1').is(':checked'),
      }

      $.post("/api/wallet", wallet, function() {
      });
  
}

})
