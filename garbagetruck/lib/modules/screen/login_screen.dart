import 'dart:async';
import 'dart:convert' as convert;
import 'dart:convert';
import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:garbagetruck/modules/core/managers/MQTTManager.dart';
import 'package:garbagetruck/modules/core/models/MQTTAppState.dart';
import 'package:garbagetruck/modules/core/widgets/status_bar.dart';
import 'package:garbagetruck/modules/helpers/screen_route.dart';
import 'package:garbagetruck/modules/helpers/status_info_message_utils.dart';
import 'package:garbagetruck/modules/screen/map_screen.dart';
import 'package:garbagetruck/modules/widgets/show_title.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:provider/provider.dart';
import 'package:http/http.dart' as http;
import 'package:get_storage/get_storage.dart';
import '../../responsive.dart';

import 'package:geolocator/geolocator.dart';

final LocationSettings locationSettings = LocationSettings(
  accuracy: LocationAccuracy.high,
  distanceFilter: 100,
);
StreamSubscription<Position> positionStream =
    Geolocator.getPositionStream(locationSettings: locationSettings)
        .listen((Position? position) {
  debugPrint(position == null
      ? 'Unknown'
      : '${position.latitude.toString()}, ${position.longitude.toString()}');
});

class login extends StatefulWidget {
  const login({Key? key}) : super(key: key);
  @override
  _loginState createState() => _loginState();
}

class _loginState extends State<login> {
  bool statusRedEye = true;
  late Timer _timer;
  late MQTTManager _manager;
  var _counter = 0;
  var _count;
  // final _url = Uri.parse('http://pytransit.szo.me/loginmoblie');
  final _url = Uri.parse('http://10.0.2.2:35000/loginmoblie');
  final TextEditingController _getUsername = TextEditingController();
  final TextEditingController _getPassword = TextEditingController();

  @override
  Widget build(BuildContext context) {
    _manager = Provider.of<MQTTManager>(context);
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    Size _size = MediaQuery.of(context).size;
    return Scaffold(
        body: SafeArea(
      child: GestureDetector(
        onTap: () => FocusScope.of(context).requestFocus(FocusNode()),
        behavior: HitTestBehavior.opaque,
        child: ListView(
          children: [
            build_img(width, height),
            build_titleapp(),
            build_textForm_username(width, height),
            build_textForm_password(width, height),
            login_button(width, height),
          ],
        ),
      ),
    ));
  }

//
  Row build_img(double width, double height) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          width: width * 0.9,
          height: height * 0.4,
          child: Image.asset('images/img3.png'),
        ),
      ],
    );
  }

  Row build_titleapp() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        ShowTitle(
            title: MyConstant.appName, textStyle: MyConstant().h1_Stlye()),
      ],
    );
  }

  Row build_textForm_username(double width, double height) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          margin: EdgeInsets.only(top: height * 0.05),
          width: width * 0.6,
          child: TextFormField(
            controller: _getUsername,
            decoration: InputDecoration(
              labelText: 'Enter Username',
              prefixIcon: Icon(Icons.account_circle),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: MyConstant.dark,
                ),
                borderRadius: BorderRadius.circular(width * height * 0.00006),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: MyConstant.light),
                borderRadius: BorderRadius.circular(width * height * 0.00006),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Row build_textForm_password(double width, double height) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          margin: EdgeInsets.only(top: height * 0.02),
          width: width * 0.6,
          child: TextFormField(
            controller: _getPassword,
            obscureText: statusRedEye,
            decoration: InputDecoration(
              suffixIcon: IconButton(
                onPressed: () {
                  setState(() {
                    statusRedEye = !statusRedEye;
                  });
                },
                icon: statusRedEye
                    ? Icon(
                        Icons.remove_red_eye,
                        color: MyConstant.primary,
                      )
                    : Icon(
                        Icons.remove_red_eye_outlined,
                        color: MyConstant.primary,
                      ),
              ),
              labelText: 'Enter Password',
              prefixIcon: Icon(Icons.lock),
              enabledBorder: OutlineInputBorder(
                borderSide: BorderSide(
                  color: MyConstant.dark,
                ),
                borderRadius: BorderRadius.circular(width * height * 0.00006),
              ),
              focusedBorder: OutlineInputBorder(
                borderSide: BorderSide(color: MyConstant.light),
                borderRadius: BorderRadius.circular(width * height * 0.00006),
              ),
            ),
          ),
        ),
      ],
    );
  }

  Row login_button(double width, double height) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Container(
          margin: EdgeInsets.only(top: height * 0.05),
          width: width * 0.5,
          child: ElevatedButton(
            child: Text("Login"),
            style: MyConstant().MyButtonStlye2(),
            onPressed: () {
              _login();
            },
          ),
        ),
      ],
    );
  }

  ///ConectMqtt and Sucribe
  void _configureAndConnect(String driverid, String carid) {
    // TODO: Use UUID
    String osPrefix = 'diver + $driverid';
    int counter = 0;

    _manager.initializeMQTTClient(host: "broker.emqx.io", identifier: osPrefix);
    _manager.connect();
    _timer = Timer.periodic(Duration(milliseconds: 100), (timer) {
      setState(() {
        if (counter == 1) {
          _subscribe(driverid, carid);
          counter = 0;
          timer.cancel();
        } else {
          counter++;
        }
      });
    });
  }

  void _subscribe(String _driverid, String _carid) {
    // for (var i in _count) {

    // }
    _manager.subScribeTo("moyanyo");
    // print("car" + _driverid + _carid);

    MaterialPageRoute route =
        MaterialPageRoute(builder: (value) => MapScreen());
    Navigator.pushReplacement(context, route);
    // Navigator.of(context)
    //     .pushNamedAndRemoveUntil('/map', (Route<dynamic> route) => false);
    // Navigator.pushNamedAndRemoveUntil(
    //     context, '/map', ModalRoute.withName('/map'));
  }

  Future _login() async {
    var username = _getUsername.text;
    var password = _getPassword.text;

    await GetStorage.init();
    final box = GetStorage();
    try {
      http.Response response = await http.post(_url, body: {
        'username': username,
        'password': password,
      }).timeout(Duration(seconds: 4));
      var _check = response.body;
      // print(_check);

      if (response.statusCode == 200 && _check.isNotEmpty) {
        final _driver = jsonDecode(response.body);
        final driver = _driver[0];
        // print(driver);

        box.write('carmatchid', "${driver['carmatch']}");
        box.write('name', "${driver['name']} ${driver['lastname']}");
        box.write('email', "${driver['email']} ");
        box.write('driver_id', "${driver['driver_id']}");
        box.write('adrs', "ที่อยู่ ${driver['address']}");
        box.write('adrs1',
            "ตำบล/แขวง ${driver['sub']} \nอำเภอ/เขต ${driver['dist']}");
        box.write('adrs2', "จังหวัด ${driver['prov']} ${driver['zip']}");
        box.write('sex', "เพศ ${driver['sex']} ");
        box.write('tell', "${driver['tell']} ");
        box.write('cid', "${driver['car_id']}");

        String dvid = '${driver['driver_id']}';
        String cvid = '${driver['car_id']}';

        // print('เช็คๆๆ' + cvid + dvid);
        _configureAndConnect(dvid, cvid);
      } else {
        final snackBar = SnackBar(
          duration: Duration(seconds: 2),
          content: Text('ล็อกอินไม่สำเร็จ'),
        );
        // Find the ScaffoldMessenger in the widget tree
        // and use it to show a SnackBar.
        ScaffoldMessenger.of(context).showSnackBar(snackBar);
      }
    } on TimeoutException catch (e) {
      // print('Timeout : $e ');
    } catch (e) {
      // print('ERROR : $e ');
    }
  }
}
