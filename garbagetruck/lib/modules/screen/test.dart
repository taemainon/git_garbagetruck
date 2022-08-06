import 'dart:ffi';
import 'dart:convert';

import 'package:flutter/material.dart';

class test extends StatefulWidget {
  const test({Key? key}) : super(key: key);

  @override
  _testState createState() => _testState();
}

class _testState extends State<test> {
  @override
  void initState() {
    mqtt();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('test'),
      ),
      body: Container(
        child: Row(
          children: [],
        ),
      ),
    );
  }
}

void mqtt() {
  var message = [
    {"driverid": "6", "lat": "19.0316967", "lng": "99.926695"},
    {"driverid": "7", "lat": "19.05555", "lng": "99.911111"},
    {"driverid": "7", "lat": "19.05552855", "lng": "99.90000"}
  ];
  message.add({"lat": "0000", "lng": "11111"});

  pub(message);
}

void pub(List<Map<String, String>> message) {
  print(message);
}
