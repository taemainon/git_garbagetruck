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

  get _count => null;

  @override
  Widget build(BuildContext context) {
    return new Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        centerTitle: true,
        // toolbarHeight: height * (5 / 100) + 20,
        actions: [
          IconButton(
            alignment: Alignment.bottomRight,
            icon: Icon(Icons.arrow_back),
            onPressed: () {
              Navigator.push(context, MaterialPageRoute(builder: (context) {
                return MapView();
              }));
            },
          ),
        ],
        title: ShowTitle(
          title: 'บันทึกน้ำหนัก',
          textStyle: TextStyle(
            color: Colors.white,
            fontSize: 25,
          ),
        ),
        backgroundColor: MyConstant.dark,
      ),
      body: new Container(
          padding: const EdgeInsets.all(80.0),
          child: new Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: <Widget>[
              new TextField(
                decoration: new InputDecoration(labelText: "เพิ่มน้ำหนัก"),
                keyboardType: TextInputType.number,
                inputFormatters: <TextInputFormatter>[
                  FilteringTextInputFormatter.digitsOnly
                ], // Only numbers can be entered
              ),
            ],
          )),
    );
  }
}
