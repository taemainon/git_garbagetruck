import 'dart:async';
import 'dart:convert';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'package:provider/provider.dart';
import '../widgets/show_title.dart';
import 'map_screen.dart';
import 'package:fluttertoast/fluttertoast.dart';

class WeighScreen extends StatefulWidget {
  const WeighScreen({Key? key}) : super(key: key);

  @override
  _WeighScreenState createState() => _WeighScreenState();
}

class _WeighScreenState extends State<WeighScreen> {
  var _counter = 0;

  // final _url = Uri.parse('http://pytransit.szo.me/loginmoblie');
  final _url = Uri.parse('http://10.0.2.2:35000/weight');
  final TextEditingController _get = TextEditingController();

  bool isSaving = false;
  int int_count = 0;
  int weigh1 = 5;
  int weigh2 = 10;
  int weigh3 = 15;
  int weigh4 = 20;
  int weigh5 = 25;
  int weigh6 = 30;

  setWeight(int weight) {
    setState(() {
      int_count += weight;
    });
  }

  onSubmit() async {
    if (!isSaving) {
      setState(() {
        isSaving = true;
      });
      final box = GetStorage();
      String carId = box.read('cid').toString();
      await _weigh(int_count, carId);
      // await Future.delayed(Duration(seconds: 1));

      setState(() {
        isSaving = false;
        int_count = 0;
        Fluttertoast.cancel();
        Fluttertoast.showToast(
            msg: "บันทึกข้อมูลสำเร็จ",
            toastLength: Toast.LENGTH_LONG,
            gravity: ToastGravity.SNACKBAR,
            timeInSecForIosWeb: 2,
            backgroundColor: Color.fromARGB(255, 7, 7, 7),
            textColor: Colors.white,
            fontSize: 16.0);
      });
    }

    // int_count
    // print('car_id: $car_id');
  }

  get _count => null;

  CreateWeigh() async {}
  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      backgroundColor: Color.fromARGB(255, 255, 255, 255),
      appBar: AppBar(
        centerTitle: true,
        // toolbarHeight: height * (5 / 100) + 20,
        leading: IconButton(
          icon: Icon(Icons.arrow_back),
          onPressed: () {
            Navigator.pushReplacement(context,
                MaterialPageRoute(builder: (context) {
              return MapView();
            }));
          },
        ),
        title: ShowTitle(
          title: 'บันทึกน้ำหนัก',
          textStyle: TextStyle(
            color: Colors.white,
            fontSize: 25,
          ),
        ),
        backgroundColor: MyConstant.dark,
      ),
      body: Container(
        color: Color.fromARGB(255, 202, 227, 231),
        padding:
            const EdgeInsets.only(top: 20, left: 20, right: 20, bottom: 50),
        child: Center(
          child: Column(
            //mainAxisAlignment: MainAxisAlignment.center,
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              Text('$int_count',
                  style: TextStyle(
                      fontSize: 50,
                      fontWeight: FontWeight.w600,
                      //backgroundColor: Color.fromARGB(255, 229, 229, 156)
                      background: Paint()
                        ..strokeWidth = 40.0
                        ..color = Color.fromARGB(255, 220, 228, 144)
                        ..style = PaintingStyle.stroke
                        ..strokeJoin = StrokeJoin.round)),
              SizedBox(height: 25),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  FloatingActionButton(
                    onPressed: () {
                      print(weigh1);
                      setWeight(weigh1);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "5",
                      style: TextStyle(fontSize: 25),
                    ),
                  ),
                  FloatingActionButton(
                    onPressed: () {
                      print(weigh2);
                      setWeight(weigh2);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "10",
                      style: TextStyle(fontSize: 25),
                    ),
                  ),
                  FloatingActionButton(
                    onPressed: () {
                      print(weigh3);
                      setWeight(weigh3);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "15",
                      style: TextStyle(fontSize: 25),
                    ),
                  )
                ],
              ),
              SizedBox(
                height: 25,
              ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: <Widget>[
                  FloatingActionButton(
                    onPressed: () {
                      setWeight(weigh4);
                      print(weigh4);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "20",
                      style: TextStyle(fontSize: 25),
                    ),
                  ),
                  FloatingActionButton(
                    onPressed: () {
                      print(weigh5);
                      setWeight(weigh5);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "25",
                      style: TextStyle(fontSize: 25),
                    ),
                  ),
                  FloatingActionButton(
                    onPressed: () {
                      print(weigh6);
                      setWeight(weigh6);
                    },
                    backgroundColor: Colors.green,
                    child: const Text(
                      "30",
                      style: TextStyle(fontSize: 25),
                    ),
                  )
                ],
              ),
              SizedBox(
                height: 70,
              ),
              ElevatedButton(
                  style: ElevatedButton.styleFrom(
                      // padding: EdgeInsets.all(20),
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(5.0),
                          side: BorderSide(color: Colors.blueAccent)),
                      fixedSize: Size(180, 50),
                      primary: Color.fromARGB(255, 0, 123, 255),
                      onPrimary: Color.fromARGB(255, 255, 0, 0),
                      onSurface: Color.fromARGB(255, 71, 0, 237)),
                  onPressed: isSaving
                      ? null
                      : () {
                          onSubmit();
                        },
                  child: isSaving
                      ? CupertinoActivityIndicator()
                      : const Text(
                          "บันทึกข้อมูล",
                          style: TextStyle(color: Colors.white, fontSize: 25),
                        ))
            ],
          ),
        ),
      ),
    );
  }

  Future _weigh(weight, car_id) async {
    var headers = {'Content-Type': 'application/x-www-form-urlencoded'};
    var request =
        http.Request('POST', Uri.parse('http://10.0.2.2:35000/save-weight'));
    request.bodyFields = {'weight': weight.toString(), 'car_id': car_id.toString()};
    request.headers.addAll(headers);

    http.StreamedResponse response = await request.send();

    if (response.statusCode == 200) {
      print(await response.stream.bytesToString());
    } else {
      print(response.reasonPhrase);
    }
  }
}
