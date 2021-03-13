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

    //Load wallets
    function createCard(wallet, owned) {

        var first = `<div class="col-lg-6 col-xl-4">
        <div class="card walletCard" data-id="${wallet.id}">
            <div class="card-body">
                <div class="row">
                    <div class="cardHeader">
                        <h6>${wallet.title}</h6>`

        var button = `<button data-id="${wallet.id}" class='btn btn-outline-dark pub-update updateWallet'>Edit</button>`;

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

    //View Wallet details
    $(document).on('click', ".walletCard", function () {
        location.href = `wallet.html?id=${$(this).data('id')}`
    });

    //Edit wallet
    $(document).on('click', ".updateWallet", function (e) {

        e.stopPropagation();
        e.preventDefault();
        
        $('#usersDiv').hide() 
        var wallet = wallets.get($(this).data('id'));
        $('#modalTitle').text('Edit Wallet');
        $('#wallet-title').val(wallet.title);
        var categories = wallet.category.split('|');
        categories.forEach(e => {
            $("#cat-list").append(`<li>${e}</li>`);
        });
        $('#publicPrivate').hide();

        if (wallet.public) {
            $('#usersDiv').show() 
            $.get(`/api/users/${wallet.id}`, (data) => {
                if (data.added.length > 0) {
                    for (email of data.added) {
                        $("#user-list").append(`<li> ${email.email} </li>`);
                    }
                }
                if (data.added.length > 0) {
                    for (email of data.invited) {
                        $("#user-list").append(`<li> ${email.email} - invited</li>`);
                    }
                }
            });
        }

        loadModal(wallet);
    });


    //Add new wallet  

    $('#newWallet').click(e => {
        e.preventDefault();

        $('#modalTitle').text('New Wallet');
        $("#privateBtn").prop("checked", true);
        $('#usersDiv').hide() 

        loadModal();

    });



    //Load modal
    function loadModal(wallet) {

        var newCat = "";
        var newUser = new Array();

        $('#cat-btn').click(e => {
            e.preventDefault();
            var text = $('#wallet-cat').val().trim();
            if (text != '') {
                newCat += (text + '|');
                $("#cat-list").append(`<li>${text}</li>`);
                $("#wallet-cat").val("")
            }
        });

        $('#user-btn').click(e => {
            e.preventDefault();
            var text = $('#user-email').val().trim();
            if (text != '') {
                newUser.push(text);
                $('#user-list').append(`<li>${text}</li>`);
                $('#user-email').val("");
            }
        });

        $("#publicBtn").change(function(){
           $('#usersDiv').show();
        });

        $("#privateBtn").change(function(){
           $('#usersDiv').hide();
        });

        $('#walletsub-btn').click(e => {
            e.preventDefault();
            if ($('#wallet-title').val().trim() == '') {
                $('#wallet-title').after('<p class="red" id="amountError">Please enter a valid title</p>');
                return;
            } else {
                $('#modal .red').remove();

                var type;
                var url;
                var data;

                if (wallet) {
                    type = 'PUT';
                    url = `/api/wallets/${wallet.id}`;
                    data = {
                        title: $('#wallet-title').val().trim(),
                        category: newCat,
                        emails: newUser
                    }
                } else {
                    type = 'POST';
                    url = '/api/wallets';
                    data = {
                        title: $('#wallet-title').val().trim(),
                        category: newCat,
                        public: !$("#privateBtn").prop("checked"),
                        emails: newUser
                    }
                }

                $.ajax({
                    type: type,
                    url: url,
                    data: data,
                    success: function (res) {
                        closeModal();
                        location.reload();
                    },
                    error: function (err) {
                        alert('Could not make changes!')
                    }
                });
            }
        });

        $('#close').click(e => {
            e.preventDefault();
            closeModal();
        })

        $('#modal').css('display', 'block');
    }


    //Handle close click
    function closeModal() {
        $('#walletsub-btn').off('click');
        $("#wallet-title").val('');
        $("#wallet-cat").val('');
        $("#user-email").val('');
        $("#cat-list").empty();
        $("#user-list").empty();
        $('#publicPrivate').show();
        $('#modal').css('display', 'none');
    }

});