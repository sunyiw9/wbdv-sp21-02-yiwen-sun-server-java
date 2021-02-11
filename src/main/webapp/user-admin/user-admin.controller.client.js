var $tableRows
var $createBtn
var $updateBtn
var $usernameFld
var $passwordFld
var $firstNameFld
var $lastNameFld
var $roleFld;

var userService = new AdminUserServiceClient();

var users = [
    {username: "sunyiw", password: "123456", firstName: "Yiwen", lastName: "Sun", role: "Student"},
]

function deleteUser(event){
    var button = $(event.target)
    var index = button.attr("id")
    var id = users[index]._id
    userService.deleteUser(id)
        .then(function (status){
            users.splice(index, 1)
            renderUsers(users)
        })
}

function createUser(){
    var newUser = {
        username: $usernameFld.val(),
        password: $passwordFld.val(),
        firstName: $firstNameFld.val(),
        lastName: $lastNameFld.val(),
        role: $roleFld.val(),
    }
    userService.createUser(newUser)
        .then(function (actualUser){
            users.push(newUser)
            renderUsers(users)

        })
    return true
}

var selectedUser = null
function selectUser(event){
    var id = $(event.target).attr("id")
    selectedUser = users.find(user => user._id === id)
    $usernameFld.val(selectedUser.username)
    $passwordFld.val(selectedUser.password)
    $firstNameFld.val(selectedUser.firstName)
    $lastNameFld.val(selectedUser.lastName)
    $roleFld.val(selectedUser.role)
}

function updateUser(){
    selectedUser.username = $usernameFld.val()
    selectedUser.password = $passwordFld.val()
    selectedUser.firstName = $firstNameFld.val()
    selectedUser.lastName = $lastNameFld.val()
    selectedUser.role = $roleFld.val()
    userService.updateUser(selectedUser._id, selectedUser)
        .then(status =>{
            var index = users.findIndex(user => user._id === selectedUser._id)
            users[index] = selectedUser
            renderUsers(users)
        })
    return true
}

function clearForm(){
    document.getElementById('usernameFld').value=''
    document.getElementById('passwordFld').value=''
    document.getElementById('firstNameFld').value=''
    document.getElementById('lastNameFld').value=''
    document.getElementById('roleFld').value='FACULTY'
}


function renderUsers(users) {
    $tableRows.empty()
    for (var i = 0; i < users.length; i++) {
        var user = users[i]
        $tableRows.append(`
            <tr class="wbdv-template wbdv-user wbdv-hidden">
            <td class="wbdv-username">${user.username}</td>
            <td>&nbsp;</td>
            <td class="wbdv-first-name">${user.firstName}</td>
            <td class="wbdv-last-name">${user.lastName}</td>
            <td class="wbdv-role">${user.role}</td>
            <td class="wbdv-actions">
        <span class="float-right">
          <i id="${i}" class="fa-2x fa fa-times wbdv-remove"></i>
          <i id="${user._id}" class="fa-2x fa fa-pencil wbdv-edit"></i>
        </span>
            </td>
        </tr>
        `)
    }
    $(".wbdv-remove").click(deleteUser)
    $(".wbdv-edit").click(selectUser)
}


function main(){
    $tableRows = jQuery("#table-rows")
    $createBtn = $(".wbdv-create")
    $updateBtn = $(".wbdv-update")

    $usernameFld = $(".wbdv-username-fld")
    $passwordFld = $(".wbdv-password-fld")
    $firstNameFld = $(".wbdv-firstname-fld")
    $lastNameFld = $(".wbdv-lastname-fld")
    $roleFld = $(".wbdv-role-fld")

    $updateBtn.click(function(){
        if(updateUser() === true){
            clearForm()
        }
    })
    $createBtn.click(function () {
        if (createUser() === true) {
            clearForm()
        }
    })


    userService.findAllUsers().then(function(actualUsers){
        users = actualUsers
        renderUsers(users)
    })
}
$(main)