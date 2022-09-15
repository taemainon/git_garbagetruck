import 'dart:async';
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import '../widgets/show_title.dart';
import 'map_screen.dart';

class WeighScreen extends StatefulWidget {
  const WeighScreen({Key? key}) : super(key: key);

  @override
  _WeighScreenState createState() => _WeighScreenState();
}

class _WeighScreenState extends State<WeighScreen> {
  int int_count = 0;
  int? weigh1 = 5;
  int? weigh2 = 10;
  int? weigh3 = 15;
  int? weigh4 = 20;
  int? weigh5 = 25;
  int? weigh6 = 30;

  get _count => null;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
        backgroundColor: Colors.white,
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
            padding: const EdgeInsets.only(
                top: 200, left: 20, right: 20, bottom: 50),
            child: new Column(
              //mainAxisAlignment: MainAxisAlignment.center,
              children: <Widget>[
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: <Widget>[
                    FloatingActionButton(
                      onPressed: () {
                        print(weigh1);
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
                      },
                      backgroundColor: Colors.green,
                      child: const Text(
                        "30",
                        style: TextStyle(fontSize: 25),
                      ),
                    )
                  ],
                ),

                // new TextField(
                //   decoration:
                //       new InputDecoration(labelText: "เพิ่มน้ำหนัก(กิโลกรัม)"),
                //   autofocus: true,
                //   keyboardType: TextInputType.number,
                //   inputFormatters: <TextInputFormatter>[
                //     FilteringTextInputFormatter.digitsOnly
                //   ], // Only numbers can be entered
                // ),
                SizedBox(
                  height: 70,
                ),
                FloatingActionButton.extended(
                  label: const Text(
                    "บันทึกข้อมูล",
                    style: TextStyle(fontSize: 25),
                  ),
                  // color: Colors.blue,
                  // textColor: Colors.white,
                  onPressed: () {},
                )
              ],
            )));
  }
}
