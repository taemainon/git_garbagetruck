import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:garbagetruck/modules/screen/map_screen.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:garbagetruck/utillity/show_progress.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;

class profileScreen extends StatefulWidget {
  const profileScreen({Key? key}) : super(key: key);

  @override
  _profileScreenState createState() => _profileScreenState();
}

class _profileScreenState extends State<profileScreen> {
  late String id = '';
  late String name = '';
  late String tell = '';
  late String email = '';
  late String date = '';
  late String point = '';
  late String total = '';
  late String plateId = '';
  late String brand = '';
  late String _color = '';
  late String adrs = '';
  late String adrs1 = '';
  late String adrs2 = '';
  late String sex = '';
  late String seat = '';
  late Timer _timer;
  late double _point = 0;
  int counter = 0;

  @override
  void initState() {
    setState(() {
      super.initState();
      getInfo();
      imgProfile();
      nameText();
      infoBox();
      carInfo();
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: ListView(
          children: [
            Column(
              children: <Widget>[
                Container(
                    decoration: BoxDecoration(
                        gradient: LinearGradient(
                            begin: Alignment.topCenter,
                            end: Alignment.bottomCenter,
                            colors: [
                          MyConstant.dark,
                          MyConstant.primary,
                          MyConstant.light,
                        ])),
                    child: Container(
                      width: double.infinity,
                      height: 250.0,
                      child: Center(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.center,
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: <Widget>[
                            imgProfile(),
                            SizedBox(
                              height: 10.0,
                            ),
                            nameText(),
                            SizedBox(
                              height: 10.0,
                            ),
                          ],
                        ),
                      ),
                    )),
                infoBox(),
                backButton(context),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Padding backButton(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(0, 0, 0, 20),
      child: Container(
        width: 300.00,
        child: RaisedButton(
            onPressed: () {
              MaterialPageRoute route =
                  MaterialPageRoute(builder: (value) => MapScreen());
              Navigator.pop(context);
            },
            shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(80.0)),
            elevation: 0.0,
            padding: EdgeInsets.all(0.0),
            child: Ink(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                    begin: Alignment.centerRight,
                    end: Alignment.centerLeft,
                    colors: [
                      MyConstant.dark,
                      MyConstant.primary,
                    ]),
                borderRadius: BorderRadius.circular(30.0),
              ),
              child: Container(
                constraints: BoxConstraints(maxWidth: 300.0, minHeight: 50.0),
                alignment: Alignment.center,
                child: Text(
                  "<กลับสู่หน้าหลัก",
                  style: TextStyle(
                      color: Colors.white,
                      fontSize: 26.0,
                      fontWeight: FontWeight.w300),
                ),
              ),
            )),
      ),
    );
  }

  CircleAvatar imgProfile() {
    return CircleAvatar(
      child: Image.asset('images/img5.png'),
      maxRadius: 80,
    );
  }

  Text nameText() {
    return Text(
      "$name",
      style: TextStyle(
        fontSize: 24.0,
        color: Colors.white,
      ),
    );
  }

  Container infoBox() {
    return Container(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 30.0, horizontal: 30.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Text(
              "ข้อมูลส่วนตัว",
              style: TextStyle(
                color: MyConstant.dark,
                fontStyle: FontStyle.normal,
                fontSize: 22.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(
              height: 10.0,
            ),
            Text(
              'ชื่อ $name\n'
              'เบอร์โทรศัพท์ $tell\n'
              'E-mail $email\n'
              '$adrs\n'
              '$adrs1\n'
              '$adrs2\n'
              '$sex\n',
              style: TextStyle(
                fontSize: 22.0,
                fontStyle: FontStyle.normal,
                fontWeight: FontWeight.w300,
                color: Colors.black,
                letterSpacing: 1.0,
              ),
            ),
            Text(
              "ข้อมูลรถ",
              style: TextStyle(
                color: MyConstant.dark,
                fontStyle: FontStyle.normal,
                fontSize: 22.0,
                fontWeight: FontWeight.bold,
              ),
            ),
            Text(
              'เลขทะเบียนรถ $plateId\n'
              'ความจุที่นั่ง $seat ที่นั่ง รุ่นรถ $brand \n'
              'สี $_color \n',
              style: TextStyle(
                fontSize: 22.0,
                fontStyle: FontStyle.normal,
                fontWeight: FontWeight.w300,
                color: Colors.black,
                letterSpacing: 1.0,
              ),
            ),
          ],
        ),
      ),
    );
  }

  void carInfo() async {
    await GetStorage.init();
    final box = GetStorage();
    id = box.read('carmatchid').toString();
    try {
      http.Response response =
          await http.post(Uri.parse('http://10.0.2.2:35000/selectcar'), body: {
        // await http
        //     .post(Uri.parse('http://pytransit.szo.me/selectcar'), body: {
        'carmatch': id,
      }).timeout(Duration(seconds: 4));
      final _car = jsonDecode(response.body);
      final car = _car[0];
      setState(() {
        plateId = "${car['License_plate']}";
        seat = "${car['seat']}";
        brand = "${car['brand']}";
        _color = "${car['color']}";
      });
      //print('titok' + "${car['License_plate']}");
    } on TimeoutException catch (e) {
      print('Timeout : $e ');
    } catch (e) {
      print('ERROR : $e ');
    }
  }

  void getInfo() async {
    await GetStorage.init();
    final box = GetStorage();
    id = box.read('carmatchid').toString();
    try {
      http.Response response =
          await http.post(Uri.parse('http://10.0.2.2:35000/date'), body: {
        // await http.post(Uri.parse('http://pytransit.szo.me/date'), body: 
        'carmatch': id,
      }).timeout(Duration(seconds: 4));
      final _date = jsonDecode(response.body);
      final date = _date[0];

      //print('namo' + "${date["DATE_FORMAT(str_date,'%Y-%m-%d')"]}");
      box.write('_date', "${date["DATE_FORMAT(str_date,'%Y-%m-%d')"]}");
    } on TimeoutException catch (e) {
      print('suphakorn: $e ');
    } catch (e) {
      print('srinak : $e ');
    }
    setState(() {
      id = box.read('carmatchid').toString();
      name = box.read('name').toString();
      tell = box.read('tell').toString();
      email = box.read('email').toString();
      point = box.read('point').toString();
      total = box.read('total').toString();
      adrs = box.read('adrs').toString();
      adrs1 = box.read('adrs1').toString();
      adrs2 = box.read('adrs2').toString();
      sex = box.read('sex').toString();
      _point = double.parse('$point');

      date = box.read('_date').toString();
    });
  }
}
