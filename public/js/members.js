$(document).ready(() => {

    var wallets = new Map();

    //Get user wallets
    $.get("/api/wallets/", function (data) {

        if (data.private.length > 0) {
            for (wallet of data.private) {
                wallets.set(wallet.id, wallet);
                var walletCard = createCard(wallet, true);
                $("#privateWallets").append(walletCard);
            }
        } else {
            $("#privateWallets").append("<p>You have no private wallets</p>")
        }

        if (data.public.length > 0) {
            for (wallet of data.public) {
                wallets.set(wallet.id, wallet);
                var walletCard = createCard(wallet, true);
                $("#publicWallets").append(walletCard);
            }
        } else {
            $("#publicWallets").append("<p>You have no public wallets</p>")
        }

        if (data.shared.length > 0) {
            for (wallet of data.shared) {
                wallets.set(wallet.id, wallet);
                var walletCard = createCard(wallet, false);
                $("#sharedWallets").append(walletCard);
            }
        } else {
            $("#sharedWallets").append("<p>No one has shared a wallet with you yet.</p>")
        }
    });

    //Append card
    function createCard(wallet, owned) {

        var first = `<div class="col-md-6 col-lg-4">
        <div class="card walletCard" data-id="${wallet.id}">
            <div class="card-body">
                <div class="row">
                    <div class="cardHeader">
                        <h6>${wallet.title}</h6>`

        var button = `<button data-id="${wallet.id}" class='btn btn-primary pub-update updateWallet'>Edit</button>`;

        var last = `</div>
        <p>Owned by ${owned ? 'you' : wallet.owner}</p>
        <p>Created on ${wallet.createdAt.split("T")[0]}</p>
        <p>Last updated on ${wallet.updatedAt.split("T")[0]}</p>
        </div>
        </div>
        </div>
        </div>`

        if (owned) {
            var card = $(first + button + last);
        } else {
            var card = $(first + last);
        }
        return card;
    }

    //View Wallet
    $(document).on('click', ".walletCard", function () {
        location.href = `wallet.html?id=${$(this).data('id')}`
    });

    //Edit wallet
    $(document).on('click', ".updateWallet", function (e) {

        e.stopPropagation();
        e.preventDefault();

        var newCat = "";
        var newUser = new Array();
        var wallet = wallets.get($(this).data('id'));
        $('#modalTitle').text('Edit Wallet');
        $('#wallet-title').val(wallet.title);
        var categories = wallet.category.split('|');
        categories.forEach(e => {
            $("#cat-list").append(`<li>${e}</li>`);
        });
        $('#publicPrivate').hide();

        if (wallet.public) {
            $.get(`/api/users/${wallet.id}`, (data) => {
                if (data.length > 0) {
                    for (email of data) {
                        $("#user-list").append(`<li> ${email.email} </li>`);
                    }
                }
            });
        }

        $('#cat-btn').click(e => {
            e.preventDefault();
            var text = $('#wallet-cat').val().trim();
            if (text != '') {
                newCat += text + '|';
                $("#cat-list").append(text);
                $("#wallet-cat").val("")
            }
        });

        $('#user-btn').click(el => {
            e.preventDefault();
            var text = $('#user-email').val().trim();
            if (text != '') {
                newUser.push(text);
                $('#user-list').append(text);
                $('#user-email').val("");
            }
        });

        $('#walletsub-btn').click(e => {
            console.log(newUser)
            e.preventDefault();
            if ($('#wallet-title').val().trim() == '') {
                $('#wallet-title').after('<p class="red" id="amountError">Please enter a valid title</p>');
                return;
            } else {
                $('#modal .red').remove();
                $.ajax({
                    type: 'PUT',
                    url: `/api/wallets/${wallet.id}`,
                    data: {
                        title: $('#wallet-title').val().trim(),
                        category: newCat,
                        emails: newUser
                    },
                    success: function (res) {
                        alert('Added!')
                        closeModal();
                        location.reload();
                    },
                    error: function (err) {
                        console.log(err);
                        alert('Could not make changes!')
                    }
                });
            }
        });
        $('#modal').css('display', 'block');
    });







    $(document).on('click', '.expense', function (e) {
        var id = $(this).data('id');

        var expense = expenses.find(e => e.id == id);
        $('#modelTitle').text('Expense Details');
        $('#title').val(expense.title);
        $('#amount').val(expense.amount);

        for (cat of categories) {
            $('#category').append(`<option value="${cat}">${cat}</option>`);
        }
        $('#category').append(`<option>Other</option>`);
        $(`#category option[value=${expense.category}]`).attr('selected', 'selected');
        $('#description').val(expense.description);
        $('#date').val(expense.date);

        for (let [id, user] of users) {
            $('#paidBy').append(`<option data-id=${id} value="${user.name}">${user.name}</option>`);
        }

        $(`#paidBy option[value="${users.get(expense.paidBy).name}"]`).attr('selected', 'selected');

        var shares = splits.get(id);
        for (let [id, user] of users) {
            var input = $('<input>');
            input.val(shares.find(e => e.userId == id).share);
            input.attr('data-id', id);
            var shareLine = $('<tr>');
            shareLine.addClass('shareLine');
            var userName = $('<td>');
            userName.text(user.name);
            shareLine.append(userName).append(input);
            $("#split table").append(shareLine).append();
        }

        $('#modal').css('display', 'block');

        $("#submit-btn").click(e => {
            e.preventDefault();
            sendExpense(id);

        });

    });























    //////Add new wallet modal//////
    var title = $("#wallet-title");
    userEmail();

    $("#close").on("click", function () {
        closeModal();
    });

    // $("#cat-btn").click(function (e) {
    //     e.preventDefault();
    //     catInput = $("input#wallet-cat").val().trim();
    //     var catli = $("<li id='cat'>");
    //     catli.text(catInput);
    //     $("#cat-list").append(catli);
    //     $("input#wallet-cat").val("")
    // })

    var emailArr = [];
    function userEmail() {
        // $("#user-btn").click(function (e) {
        //     e.preventDefault();
        //     emailInput = $("input#user-email").val();
        //     emailArr.push(emailInput)

        //     var list = "";
        //     for (var i = 0; i < emailArr.length; i++) {
        //         list += "<li id='user'>" + emailArr[i] + "</li>";
        //     }
        //     $("#user-list").append(list);
        //     $("input#user-email").val("")
        // })
    }

    // $("#walletsub-btn").on("click", function (event) {
    //     event.preventDefault();
    //     alert("test")
    //     createWallet();
    //     closeModal();
    //     location.reload();
    // })

    function createWallet() {
        var wallet = {
            title: title.val().trim(),
            category: $("input#wallet-cat").val(),
            public: $('#exampleRadios1').is(':checked'),
        }

        console.log(wallet)

        $.post("/api/wallet", wallet, function () {
            closeModal();
        });

    }

    function closeModal() {

        $("#wallet-title").val('');
        $("#wallet-cat").val('');
        $("#user-email").val('');
        $("#cat-list").empty();
        $("#user-list").empty();
        $('#publicPrivate').show();
        $('#modal').css('display', 'none');
    }

    //////Add new wallet end//////




})






































