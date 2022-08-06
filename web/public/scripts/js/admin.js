$(document).ready(function () {
  var statusCard = null
  var statusPhone = null
  var mode = ''
  var blogID = 0
  $('.closes').click(function () {
    $('#exampleModal').modal('toggle')
  })

  $('.close2').click(function () {
    $('#exampleModal2').modal('toggle')
  })

  $('.btnDelete').click(function () {
    blogID = $(this).attr('blogID')
    $('#exampleModal2').modal('toggle')
  })
  getprovince()

  $('#btnModalSave').click(function (e) {
    e.preventDefault()
    // close modal

    // add
    let data = {
      username: $('#username').val(),
      password: $('#password').val(),
      name: $('#name').val(),
      lastname: $('#editer').val(),
      tell: $('#tel').val(),
      email: $('#email').val(),
      id_card: $('#card').val(),
      address: $('#address').val(),
      sub: $('#sub').val(),
      dist: $('#dist').val(),
      prov: $('#prov').val(),
      zip: $('#zip').val(),
      sex: $('#sex').val(),
      role: $('#selectrole').val(),
    }
    var ele = document.getElementById('card')
    var ele1 = document.getElementById('tel')

    if (ele1.value.length != 10 && ele.value.length != 13) {
      // alert('กรุณากรอกเลขบัตรให้ครบ 13 หลัก')
      statusPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
      document.getElementById('statusPhone').innerHTML = statusPhone
      statusCard = 'กรุณากรอกเลขบัตรให้ครบ 13 หลัก'
      document.getElementById('statusCard').innerHTML = statusCard
    } else {
      if (ele1.value.length != 10 && ele.value.length == 13) {
        // alert('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง')
        statusPhone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'
        document.getElementById('statusPhone').innerHTML = statusPhone
        document.getElementById('statusCard').innerHTML = ''
      } else if (ele.value.length != 13 && ele1.value.length == 10) {
        statusCard = 'กรุณากรอกเลขบัตรให้ครบ 13 หลัก'
        document.getElementById('statusCard').innerHTML = statusCard
        document.getElementById('statusPhone').innerHTML = ''
      } else {
        document.getElementById('statusPhone').innerHTML = ''
        document.getElementById('statusCard').innerHTML = ''

        let method = 'POST'
        let url = '/adminse/new'

        // edit
        if (mode == 'edit') {
          console.log($('#prov').text())
          data = {
            username: $('#username').val(),
            password: $('#password').val(),
            name: $('#name').val(),
            lastname: $('#editer').val(),
            tell: $('#tel').val(),
            id_card: $('#card').val(),
            email: $('#email').val(),
            address: $('#address').val(),
            sub: $('#sub').val(),
            dist: $('#dist').val(),
            prov: $('#prov').val(),
            zip: $('#zip').val(),
            sex: $('#sex').val(),
            role: $('#selectrole').val(),
            driver_id: blogID,
          }
          method = 'PUT'
          url = '/adminse/edit'
        }

        $.ajax({
          type: method,
          url: url,
          data: data,
          success: function (response) {
            alert('Success')
            window.location.replace(response)
          },
          error: function (xhr) {
            Swal.fire({
              icon: 'error',
              title: xhr.responseText,
            })
          },
        })
        $('#exampleModal').modal('toggle')
      }
    }
  })

  $('#adduser').click(function () {
    mode = 'add'
    document.getElementById('statusPhone').innerHTML = ''
    document.getElementById('statusCard').innerHTML = ''
    $('#btnModalSave').html('เพิ่ม')
    // change the modal title
    // change the modal title
    $('#exampleModalLabel').text('เพิ่มคนขับรถ')
    // console.log(postData);
    $('#username').val('')
    $('#password').val('')
    $('#name').val('')
    $('#editer').val('')
    $('#email').val('')
    $('#tel').val('')
    $('#card').val('')
    $('#address').val('')
    $('#sub').val('')
    $('#dist').val('')
    $('#prov').val('')
    $('#zip').val('')
    $('#sex').val('')
    $('#selectrole').val('')

    // show modal
    $('#exampleModal').modal('toggle')
  })

  // Edit button
  $('.editbut').click(function () {
    mode = 'edit'

    $('#btnModalSave').html('แก้ไข')

    // change the modal title
    $('#exampleModalLabel').text('แก้ไขคนขับ')
    // show modal
    $('#exampleModal').modal('toggle')
    // get selected post data
    const postData = JSON.parse($(this).attr('blogData'))
    // console.log(postData);
    $('#username').val(postData.username)
    $('#name').val(postData.name)
    $('#editer').val(postData.lastname)
    $('#email').val(postData.email)
    $('#tel').val(postData.tell)
    $('#card').val(postData.id_card)
    $('#address').val(postData.address)
    $('#sub').val(postData.sub)
    $('#dist').val(postData.dist)
    $('#prov').val(postData.prov)
    $('#zip').val(postData.zip)
    $('#sex').val(postData.sex)
    $('#selectrole').val(postData.role)
    blogID = postData.driver_id
  })

  // $("#deletekiki").click(function () {
  //     $.ajax({
  //         type: "DELETE",
  //         url: "/adminse/" + blogID,
  //         data: { id: blogID },
  //     }).done(function (data, state, xhr) {
  //         alert("delete success")
  //             window.location.replace(data)
  //     })
  // })

  function getprovince() {
    $('#prov').change(function () {
      getamphur($('#prov').val())
    })
    $.ajax({
      type: 'POST',
      url: '/get_province',
      success: function (response) {
        for (let i = 0; i < 77; i++) {
          $('#prov').append(
            "<option value='" +
              response[i].name_th +
              " '>" +
              response[i].name_th +
              '</option>',
          )
          // document.getElementById("prov").options[i].text=5
          // prov.text = response[i].name_th
        }
      },
      error: function (xhr) {
        Swal.fire({
          icon: 'error',
          title: xhr.responseText,
        })
      },
    })
  }

  function getdistrict(dis) {
    $('#sub').change(function () {
      getzip($('#sub').val(), dis)
    })
    $.ajax({
      type: 'POST',
      url: '/get_dist',
      data: { id: dis },
      success: function (response) {
        $('#sub').empty()
        for (let i = 0; i < 77; i++) {
          $('#sub').append(
            "<option value='" +
              response[i].name_th +
              "'>" +
              response[i].name_th +
              '</option>',
          )
          // document.getElementById("prov").options[i].text=5
          // prov.text = response[i].name_th
        }
      },
      error: function (xhr) {
        Swal.fire({
          icon: 'error',
          title: xhr.responseText,
        })
      },
    })
  }

  function getamphur(dis) {
    $('#dist').change(function () {
      getdistrict($('#dist').val())
    })
    $.ajax({
      type: 'POST',
      url: '/get_amphures',
      data: { id: dis },
      success: function (response) {
        var select = document.getElementById('dist')
        var length = select.options.length
        for (i = length - 1; i >= 0; i--) {
          select.options[i] = null
        }
        for (let i = 0; i < 77; i++) {
          $('#dist').append(
            "<option value='" +
              response[i].name_th +
              "'>" +
              response[i].name_th +
              '</option>',
          )
          // document.getElementById("prov").options[i].text=5
          // prov.text = response[i].name_th
        }
      },
      error: function (xhr) {
        Swal.fire({
          icon: 'error',
          title: xhr.responseText,
        })
      },
    })
  }

  function getzip(dis, aum) {
    $.ajax({
      type: 'POST',
      url: '/get_zip',
      data: { id: dis, aum: aum },
      success: function (response) {
        $('#zip').val(response[0].zip_code)
      },
      error: function (xhr) {
        Swal.fire({
          icon: 'error',
          title: xhr.responseText,
        })
      },
    })
  }
})
