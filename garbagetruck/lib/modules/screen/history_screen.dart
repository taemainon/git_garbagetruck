import 'dart:async';
import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:get_storage/get_storage.dart';
import 'package:http/http.dart' as http;
import 'map_screen.dart';

class historyScreen extends StatefulWidget {
  const historyScreen({Key? key}) : super(key: key);

  @override
  _historyScreenState createState() => _historyScreenState();
}

class _historyScreenState extends State<historyScreen> {
  late String id = '';
  List data = [];
  List<DataRow> zip = [];

  @override
  void initState() {
    getInfo();
    final box = GetStorage();
    id = box.read('driver_id').toString();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    double _height = MediaQuery.of(context).size.height;
    double _width = MediaQuery.of(context).size.width;

    return Scaffold(
      appBar: PreferredSize(
        preferredSize: Size.fromHeight(40.0),
        child: AppBar(
          leading: IconButton(
            icon: Icon(Icons.arrow_back, color: Colors.white),
            onPressed: () => Navigator.of(context).pop(),
          ),
          iconTheme: IconThemeData(
            color: Colors.black, //change your color here
          ),
          backgroundColor: MyConstant.dark,
          elevation: 0,
        ),
      ),
      body: SafeArea(
        child: ListView(
          children: [
            Stack(
              children: <Widget>[
                Container(
                  height: (_height > _width)
                      ? _height * (15 / 100)
                      : _height * (20 / 100),
                  decoration: BoxDecoration(
                      gradient: LinearGradient(
                          begin: Alignment.topCenter,
                          end: Alignment.bottomCenter,
                          colors: [
                        MyConstant.dark,
                        MyConstant.primary,
                        MyConstant.light,
                      ])),
                ),
                Container(
                  width: double.infinity,
                  child: Column(
                    children: <Widget>[
                      SizedBox(
                        height: (_height > _width)
                            ? _height * (22 / 100)
                            : _height * (35 / 100),
                      ),
                      Card(
                        child: DataTable(
                          columnSpacing:
                              (MediaQuery.of(context).size.width / 10) * 0.7,
                          dataRowHeight: 80,
                          columns: [
                            DataColumn(
                                label: Text(
                              'วันที่',
                              style: TextStyle(fontWeight: FontWeight.bold),
                            )),
                            DataColumn(
                                label: Text('เลขทะเบียน',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold))),
                            DataColumn(
                                label: Text('รุ่น',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold))),
                            DataColumn(
                                label: Text('สี',
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold))),
                          ],
                          rows: zip,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  width: double.infinity,
                  child: Column(
                    children: <Widget>[
                      SizedBox(
                        height: (_height > _width)
                            ? _height * (3 / 100)
                            : _height * (0.1 / 100),
                      ),
                      Card(
                        shadowColor: Colors.black,
                        elevation: 20,
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.all(
                              Radius.circular(50),
                            ),
                          ),
                          width: _width * (60 / 100),
                          height: (_height > _width)
                              ? _height * (15 / 100)
                              : _height * (30 / 100),
                          child: Padding(
                            padding: const EdgeInsets.all(20),
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Icon(
                                  Icons.history,
                                  size: 30,
                                ),
                                SizedBox(),
                                Text(
                                  'รายการจับคู่รถเดือนนี้',
                                  style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void getInfo() async {
    await GetStorage.init();
    try {
      http.Response response =
          await http.post(Uri.parse('http://10.0.2.2:35000/hist'), body: {
        // await http.post(Uri.parse('http://pytransit.szo.me/hist'), body: {
        'driver_id': id,
      }).timeout(Duration(seconds: 4));
      data = jsonDecode(response.body);

      for (var i in data) {
        //print("${i['date']}");
        setState(() {
          zip.add(
            DataRow(cells: [
              DataCell(Text('${i['date']}')),
              DataCell(Text('${i['License_plate']}')),
              DataCell(Text('${i['brand']}')),
              DataCell(Text('${i['color']}')),
            ]),
          );
        });
      }

      //print('namo' + "${date["DATE_FORMAT(str_date,'%Y-%m-%d')"]}");
      // box.write('_date', "${date["DATE_FORMAT(str_date,'%Y-%m-%d')"]}");
    } on TimeoutException catch (e) {
      print('suphakorn: $e ');
    } catch (e) {
      print('srinak : $e ');
    }
    // setState(() {

    //   // name = box.read('name').toString();
    //   // tell = box.read('tell').toString();
    //   // email = box.read('email').toString();
    //   // point = box.read('point').toString();
    //   // total = box.read('total').toString();
    //   // _point = double.parse('$point');

    //   // date = box.read('_date').toString();
    // });
  }
}
