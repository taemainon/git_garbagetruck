import 'dart:async';
import 'dart:convert';

import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:garbagetruck/modules/screen/history_screen.dart';
import 'package:garbagetruck/modules/screen/login_screen.dart';
import 'package:garbagetruck/modules/screen/profile.dart';
import 'package:garbagetruck/modules/screen/weigh_screen.dart';
import 'package:garbagetruck/modules/widgets/show_icon_button.dart';
import 'package:garbagetruck/modules/widgets/show_title.dart';
import 'package:garbagetruck/secrets.dart';
import 'package:garbagetruck/utillity/my_constant.dart';
import 'package:garbagetruck/utillity/show_progress.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import 'package:google_maps_flutter/google_maps_flutter.dart';
import 'package:flutter_polyline_points/flutter_polyline_points.dart';
import 'package:provider/provider.dart';
import 'package:geolocator/geolocator.dart';
import 'package:garbagetruck/modules/core/managers/MQTTManager.dart';
import 'package:http/http.dart' as http;
//import 'package:wakelock/wakelock.dart';
// import 'package:http/http.dart';

class MapScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Flutter Maps',
      theme: ThemeData(
        primarySwatch: Colors.blue,
      ),
      home: MapView(),
    );
  }
}

class MapView extends StatefulWidget {
  @override
  _MapViewState createState() => _MapViewState();
}

class _MapViewState extends State<MapView> {
  /*ประกาศตัวแปร*/
  // final _url = Uri.parse('http://pytransit.szo.me/addlocation');
  final _url = Uri.parse('http://10.0.2.2:35000/addlocation');
  late String _name = '';
  late String _email = '';
  late String driverid = '';
  late String carid = '';
  late Timer _timer;
  double? lat, lng;
  // bool _picture = true;
  late GoogleMapController mapController;
  late double p = 0;
  int countingtin = 0;
  late MQTTManager _manager;
  StreamSubscription<Position>? positionStream;
  StreamSubscription<Position>? sendLocation;
  bool track_button = true;
  late Position _currentPosition;
  final startAddressController = TextEditingController();
  final destinationAddressController = TextEditingController();
  final startAddressFocusNode = FocusNode();
  final desrinationAddressFocusNode = FocusNode();
  double _originLatitude = 19.0285386, _originLongitude = 99.9280334;
  double _destLatitude = 19.0275033, _destLongitude = 99.922485;
  double _onwaylat = 19.0281170, _onwaylng = 99.9280268;
  double _originLatitude1 = 19.0280917, _originLongitude1 = 99.9280152;
  double _destLatitude1 = 19.0280988, _destLongitude1 = 99.9280153;

  PolylinePoints polylinePoints = PolylinePoints();
  Map<PolylineId, Polyline> polylines = {};
  List<Marker> _marker = [];
  List wayPoint = [];
  /*ประกาศตัวแปร*/

  /*ดึงค่าตอนเริ่มต้น*/
  @override
  void initState() {
    findposition();
    getInfo();
    _getPolyline();
    _updatelocation();
    calculateStar();

    super.initState();
  }
  /*ดึงค่าตอนเริ่มต้น*/

  /*สร้าง UI*/
  @override
  Widget build(BuildContext context) {
    _manager = Provider.of<MQTTManager>(context);
    double height = MediaQuery.of(context).size.height;
    double width = MediaQuery.of(context).size.width;
    Size size = MediaQuery.of(context).size;

    return Container(
      height: height,
      width: width,
      child: Scaffold(
        drawer: ConstrainedBox(
          constraints: BoxConstraints(maxWidth: width * (50 / 100)),
          child: buildDrawer(width),
        ),
        appBar: AppBar(
          centerTitle: true,
          toolbarHeight: height * (5 / 100) + 20,
          title: ShowTitle(
            title: MyConstant.appName,
            textStyle: TextStyle(
              color: Colors.white,
              fontSize: 20,
            ),
          ),
          backgroundColor: MyConstant.dark,
          actions: [],
        ),
        body: Stack(
          children: <Widget>[
            buildMap(),
            zoombutton(width, height),
            trackingbutton(width, height),
          ],
        ),
      ),
    );
  }
  /*สร้าง UI*/

  /*ฟังก์ชั่นการทำงาน*/
  SafeArea trackingbutton(double width, double height) {
    return SafeArea(
        child: Column(
      children: [
        Padding(
          padding: EdgeInsets.fromLTRB(325, 500, 0, 0),
          child: ClipOval(
            child: Material(
              color: Colors.orange[100], // button color
              child: InkWell(
                  splashColor: Colors.orange, // inkwell color
                  child: CircleAvatar(
                    backgroundColor: Colors.orange[200],
                    radius: 30,
                    child: track_button
                        ? Icon(
                            Icons.explore,
                            color: Colors.black,
                          )
                        : Icon(
                            Icons.my_location,
                            color: Colors.black,
                          ),
                  ),
                  onTap: () {
                    setState(() {
                      track_button ? _cameratrack() : _uncameratrack();
                      track_button = !track_button;
                    });
                  }),
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.fromLTRB(325, 4, 0, 0),
          child: ClipOval(
            child: Material(
              color: Colors.green, // button color
              child: InkWell(
                  splashColor: Colors.green.shade100, // inkwell color
                  child: CircleAvatar(
                      backgroundColor: Colors.green[200],
                      radius: 30,
                      child: Icon(
                        Icons.add_chart,
                        color: Colors.black,
                      )),
                  onTap: () {
                    Navigator.pushReplacement(context,
                        MaterialPageRoute(builder: (context) => WeighScreen()));
                    //
                    // );
                  }),
            ),
          ),
        ),
      ],
    ));
  }

  SafeArea zoombutton(double width, double height) {
    return SafeArea(
      child: Padding(
        padding: EdgeInsets.only(left: 10),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            ClipOval(
              child: Material(
                color: Colors.blue.shade100, // button color
                child: InkWell(
                  splashColor: Colors.blue, // inkwell color
                  child: SizedBox(
                    width: 60,
                    height: 60,
                    child: Icon(Icons.add),
                  ),
                  onTap: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomIn(),
                    );
                  },
                ),
              ),
            ),
            SizedBox(height: height * 0.03),
            ClipOval(
              child: Material(
                color: Colors.blue.shade100, // button color
                child: InkWell(
                  splashColor: Colors.blue, // inkwell color
                  child: SizedBox(
                    width: 60,
                    height: 60,
                    child: Icon(Icons.remove),
                  ),
                  onTap: () {
                    mapController.animateCamera(
                      CameraUpdate.zoomOut(),
                    );
                  },
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget buildMap() {
    return Container(
      child: GoogleMap(
        initialCameraPosition: CameraPosition(
          target: LatLng(19.0308, 99.9265),
          zoom: 15,
        ),
        myLocationEnabled: true,
        myLocationButtonEnabled: false,
        mapType: MapType.normal,
        zoomGesturesEnabled: true,
        zoomControlsEnabled: false,
        mapToolbarEnabled: false,
        markers: _marker.map((e) => e).toSet(),
        polylines: Set<Polyline>.of(polylines.values),
        onMapCreated: (GoogleMapController controller) {
          mapController = controller;
        },
      ),
    );
  }

  void _getPolyline() async {
    List<LatLng> polylineCoordinates = [];
    List<LatLng> polylineCoordinates1 = [];

    PolylineResult result = await polylinePoints.getRouteBetweenCoordinates(
      Secrets.API_KEY,
      PointLatLng(_originLatitude, _originLongitude),
      PointLatLng(_destLatitude, _destLongitude),
      wayPoints: [
        (PolylineWayPoint(
          location: '$_onwaylat,$_onwaylng',
        ))
      ],
      travelMode: TravelMode.driving,
    );
    PolylineResult result1 = await polylinePoints.getRouteBetweenCoordinates(
      Secrets.API_KEY,
      PointLatLng(_originLatitude1, _originLongitude1),
      PointLatLng(_destLatitude1, _destLongitude1),
      travelMode: TravelMode.driving,
    );
    if (result.points.isNotEmpty || result1.points.isNotEmpty) {
      result.points.forEach((PointLatLng point) {
        polylineCoordinates.add(LatLng(point.latitude, point.longitude));
      });
      result1.points.forEach((PointLatLng point) {
        polylineCoordinates1.add(LatLng(point.latitude, point.longitude));
      });
    } else {
      // print('err_poly ${result.errorMessage}');
      // print('err_poly1 ${result1.errorMessage}');
    }
    _addPolyLine(polylineCoordinates);
    _addPolyLine1(polylineCoordinates1);
  }

  _addPolyLine(List<LatLng> polylineCoordinates) {
    PolylineId id = PolylineId("poly");
    Polyline polyline = Polyline(
      polylineId: id,
      color: MyConstant.blue,
      points: polylineCoordinates,
      width: 8,
    );
    polylines[id] = polyline;
    setState(() {});
  }

  _addPolyLine1(List<LatLng> polylineCoordinates) {
    PolylineId id = PolylineId("poly1");
    Polyline polyline = Polyline(
      polylineId: id,
      color: MyConstant.blue,
      points: polylineCoordinates,
      width: 8,
    );
    polylines[id] = polyline;
    setState(() {});
  }

  Future<Position?> findposition() async {
    Position _position;
    try {
      _position = await Geolocator.getCurrentPosition();
      return _position;
    } catch (e) {
      return null;
    }
  }

  void _updatelocation() {
    sendLocation =
        Geolocator.getPositionStream().listen((Position position) async {
      _currentPosition = position;
      // print(message);
      // debugPrint('ฮัลโลออกมา:' + driverid);
      var text = jsonEncode({
        "topic": driverid.toString(),
        "lat": position.latitude,
        "lng": position.longitude
      });
      _manager.publish(text);

      // print(position);
      // print("\n\n\n\n\n\n\n\n\n\n");

      // _publishMessage(":lat:" +
      //     position.latitude.toString() +
      //     ":lng:" +
      //     position.longitude.toString());

      await GetStorage.init();
      final box = GetStorage();
      String car = box.read('carmatchid').toString();

      if (countingtin == 30) {
        try {
          http.Response response = await http.post((_url), body: {
            'carmatch': car,
            'lat': position.latitude.toString(),
            'lng': position.longitude.toString(),
          }).timeout(Duration(seconds: 4));
          var _check = response.body;

          if (response.statusCode == 200) {
            // print('Upload to database $_currentPosition');
            countingtin = 0;
          } else {
            final snackBar = SnackBar(
              duration: Duration(seconds: 2),
              content: Text('Server Error'),
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
      } else {
        // print('CURRENT LOCATION $_currentPosition');
        // print('counting $countingtin');
        countingtin++;
      }
    });
  }

  void _cameratrack() {
    positionStream = Geolocator.getPositionStream().listen((Position position) {
      mapController.animateCamera(
        CameraUpdate.newCameraPosition(
          CameraPosition(
            target: LatLng(position.latitude, position.longitude),
            zoom: 16.0,
          ),
        ),
      );
    });
  }

  void _uncameratrack() {
    positionStream?.cancel();
  }

  Drawer buildDrawer(double width) {
    return Drawer(
      child: Container(
        //color: MyConstant.light,
        child: ListView(
          padding: EdgeInsets.all(0),
          children: [
            headerDrawer(),
            titleDrawer(width),
          ],
        ),
      ),
    );
  }

  UserAccountsDrawerHeader headerDrawer() {
    return UserAccountsDrawerHeader(
      decoration: BoxDecoration(
        color: MyConstant.dark,
      ),
      accountName: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ShowTitle(
          title: _name,
          textStyle: TextStyle(
            fontSize: 17,
            color: Colors.white,
          ),
        ),
      ),
      accountEmail: Padding(
        padding: const EdgeInsets.all(8.0),
        child: ShowTitle(
          title: _email,
          textStyle: TextStyle(
            fontSize: 16,
            color: Colors.white,
          ),
        ),
      ),
      currentAccountPicture: Padding(
        padding: const EdgeInsets.all(8.0),
        child: CircleAvatar(
          backgroundImage: AssetImage("images/img5.png"),
          maxRadius: 250,
        ),
      ),
    );
  }

  Container titleDrawer(double width) {
    return Container(
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 10, 15, 10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                primary: MyConstant.primary,
                shadowColor: Colors.black,
                onSurface: Colors.black,
              ),
              onPressed: () {
                Navigator.pop(context);
                MaterialPageRoute route =
                    MaterialPageRoute(builder: (value) => profileScreen());
                Navigator.push(context, route);
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(Icons.account_circle),
                  Text(
                    'Profile',
                  ),
                  SizedBox(
                    width: 10,
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                primary: Colors.green,
                shadowColor: Colors.black,
                onSurface: Colors.black,
              ),
              onPressed: () {
                Navigator.pop(context);
                MaterialPageRoute route =
                    MaterialPageRoute(builder: (value) => historyScreen());
                Navigator.push(context, route);
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(Icons.history),
                  Text(
                    'History',
                  ),
                  SizedBox(
                    width: 10,
                  ),
                ],
              ),
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(15, 0, 15, 10),
            child: ElevatedButton(
              style: ElevatedButton.styleFrom(
                primary: Colors.red[900],
                shadowColor: Colors.black,
                onSurface: Colors.black,
              ),
              onPressed: () {
                var text =
                    jsonEncode({"topic": driverid.toString(), "status": '0'});
                _manager.publish(text);
                _disconnect();
              },
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Icon(Icons.logout),
                  Text(
                    'Logout',
                  ),
                  SizedBox(
                    width: 10,
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  void _disconnect() async {
    await GetStorage.init();
    final box = GetStorage();
    box.erase();
    _manager.disconnect();
    int counter = 0;
    _timer = Timer.periodic(Duration(milliseconds: 1000), (timer) {
      setState(() {
        if (counter == 1) {
          //Navigator.pushReplacementNamed(context, '/login');
          counter = 0;
          _timer.cancel();
          MaterialPageRoute route =
              MaterialPageRoute(builder: (value) => login());
          Navigator.pushReplacement(context, route);

          ///----------
          // Navigator.of(context).pushNamedAndRemoveUntil(
          //     '/login', (Route<dynamic> route) => false);
          ///----------
          // Navigator.pop(context);

        } else {
          counter++;
        }
      });
    });
    sendLocation?.cancel();
    //Wakelock.disable();
  }

  void getInfo() async {
    await GetStorage.init();
    final box = GetStorage();
    _name = box.read('name').toString();
    _email = box.read('email').toString();
    driverid = box.read('driver_id').toString();
    carid = box.read('cid').toString();
  }

  void calculateStar() async {
    await GetStorage.init();
    final box = GetStorage();
    String id = box.read('driver_id').toString();
    double sum = 0;
    int count = 0;
    try {
      http.Response response = await http
          .post(Uri.parse('http://10.0.2.2:35000/query_point'), body: {
        // await http
        //     .post(Uri.parse('http://pytransit.szo.me/query_point'), body: {
        'driver_id': id,
      }).timeout(Duration(seconds: 4));
      List data = jsonDecode(response.body);
      for (var i in data) {
        var point = double.parse('${i['point']}');
        //print('data_ : $point');
        sum += point;
        count++;
      }
      //print('data_coubt : $count');
      //print('data_sum : $sum');
      p = sum / count;
      box.write('total', "$count");
      box.write('point', "$p");
      //print('data_point : $p');
    } on TimeoutException catch (e) {
      // print('Timeout : $e ');
    } catch (e) {
      // print('ERROR : $e ');
    }
  }

  // Future updateStatus(var id, var drverid) async {
  //   try {
  //     http.Response response =
  //         await http.put(Uri.parse('http://10.0.2.2:35000/setstatus'), body: {
  //       // await http.put(Uri.parse('http://pytransit.szo.me/setstatus'), body: {
  //       'request_id': id,
  //       'res_driver': drverid,
  //     }).timeout(Duration(seconds: 4));
  //   } on TimeoutException catch (e) {
  //     print('Timeout : $e ');
  //   } catch (e) {
  //     print('ERROR : $e ');
  //   }
  // }

  // Future get_count_in() async {
  //   try {
  //     http.Response response =
  //         await http.get(Uri.parse('http://10.0.2.2:35000/count_in'));
  //     // await http.get(Uri.parse('http://pytransit.szo.me/count_in'));

  //     List data = jsonDecode(response.body);
  //     for (var i in data) {
  //       setState(() {
  //         _in = int.parse('${i['COUNT(request_id)']}');
  //         // print('atyaty$count');
  //       });
  //     }
  //   } on TimeoutException catch (e) {
  //     print('Timeout : $e ');
  //   } catch (e) {
  //     print('ERROR : $e ');
  //   }
  // }

  // Future get_count_out() async {
  //   try {
  //     http.Response response =
  //         await http.get(Uri.parse('http://10.0.2.2:35000/count_out'));
  //     // await http.get(Uri.parse('http://pytransit.szo.me/count_out'));
  //     List data = jsonDecode(response.body);
  //     for (var i in data) {
  //       setState(() {
  //         _out = int.parse('${i['COUNT(request_id)']}');
  //         // print('atyaty$count');
  //       });
  //     }
  //   } on TimeoutException catch (e) {
  //     print('Timeout : $e ');
  //   } catch (e) {
  //     print('ERROR : $e ');
  //   }
  // }

  // Future get_location() async {
  //   try {
  //     http.Response response =
  //         await http.get(Uri.parse('http://10.0.2.2:35000/query_location'));
  //     // await http.get(Uri.parse('http://pytransit.szo.me/query_location'));
  //     List data = jsonDecode(response.body);
  //     for (var i in data) {
  //       var user_lat = double.parse('${i['lat']}');
  //       var user_lng = double.parse('${i['lng']}');
  //       var user_status = int.parse('${i['status']}');
  //       // var user_status = int.parse('${i['status']}');
  //       var user_route = int.parse('${i['route']}');
  //       var marker_id = int.parse('${i['request_id']}');
  //       if (user_status != 0) {
  //         _marker.add(
  //           Marker(
  //             markerId: MarkerId('$marker_id'),
  //             position: LatLng(user_lat, user_lng),
  //             icon: (user_route == 1)
  //                 ? BitmapDescriptor.defaultMarkerWithHue(
  //                     BitmapDescriptor.hueGreen,
  //                   )
  //                 : BitmapDescriptor.defaultMarkerWithHue(
  //                     BitmapDescriptor.hueRed,
  //                   ),
  //             onTap: () {
  //               showDialog<String>(
  //                 context: context,
  //                 builder: (BuildContext context) =>
  //                     _AlertDialog(context, marker_id),
  //               );
  //             },
  //           ),
  //         );
  //       }
  //     }
  //   } on TimeoutException catch (e) {
  //     print('Timeout : $e ');
  //   } catch (e) {
  //     print('ERROR : $e ');
  //   }
  // }

  // AlertDialog _AlertDialog(BuildContext context, int marker_id) {
  //   return AlertDialog(
  //     contentPadding: const EdgeInsets.fromLTRB(10, 0, 10, 0),
  //     actions: [
  //       Column(
  //         mainAxisAlignment: MainAxisAlignment.start,
  //         children: [
  //           Row(
  //             mainAxisAlignment: MainAxisAlignment.end,
  //             children: [
  //               CloseButton(),
  //             ],
  //           ),
  //           Row(
  //             mainAxisAlignment: MainAxisAlignment.center,
  //             children: [
  //               Container(
  //                 child: Expanded(
  //                   child: ElevatedButton(
  //                     child: Text(
  //                       "ยืนยันการขึ้นรถ",
  //                       overflow: TextOverflow.ellipsis,
  //                     ),
  //                     style: MyConstant().MyButtonStlye(),
  //                     onPressed: () {
  //                       Navigator.pop(context, 'OK');
  //                       setState(() {
  //                         _marker.removeWhere((element) =>
  //                             element.markerId == MarkerId('$marker_id'));
  //                         updateStatus('$marker_id', '$driverid');
  //                         //_publishMessage("diverid:" + driverid);
  //                       });
  //                     },
  //                   ),
  //                 ),
  //               ),
  //               SizedBox(
  //                 width: 10,
  //               ),
  //               Container(
  //                 child: Expanded(
  //                   child: ElevatedButton(
  //                     child: Text(
  //                       "ลบหมุดตำแหน่ง",
  //                       overflow: TextOverflow.ellipsis,
  //                     ),
  //                     style: MyConstant().MyButtonStlye1(),
  //                     onPressed: () {
  //                       Navigator.pop(context, 'Cancel');
  //                       setState(() {
  //                         _marker.removeWhere((element) =>
  //                             element.markerId == MarkerId('$marker_id'));
  //                         updateStatus('$marker_id', '$driverid');
  //                         // _publishMessage("diverid:" + driverid);
  //                       });
  //                     },
  //                   ),
  //                 ),
  //               ),
  //             ],
  //           ),
  //         ],
  //       )
  //     ],
  //   );
  // }

  // void _publishMessage(text) {
  //   String osPrefix = '$driverid';
  //   final String message = osPrefix + text;
  //   _manager.publish(message);
  //   // _messageTextController.clear();
  //   // for (var item in text) {
  //   //   print(text);
  //   // }
  // }

  // Future<Null> finlatlng() async {
  //   Position? _position = await findposition();
  //   setState(() {
  //     lat = _position?.latitude;
  //     lng = _position?.longitude;
  //   });
  // }

  // SafeArea reviewBox(double width, BuildContext context, double height) {
  //   return SafeArea(
  //     child: Padding(
  //       padding: EdgeInsets.only(top: height * (3 / 100)),
  //       child: Row(
  //         mainAxisAlignment: MainAxisAlignment.center,
  //         children: [
  //           Container(
  //             decoration: BoxDecoration(
  //               color: Colors.white,
  //               borderRadius: BorderRadius.all(
  //                 Radius.circular(width * height * 0.01),
  //               ),
  //             ),
  //             width: 275,
  //             height: 100,
  //             child: Row(
  //               children: [
  //                 Expanded(
  //                   child: Container(
  //                     //height: height * 0.1,
  //                     child: Row(
  //                       children: [
  //                         img_Profile(),
  //                         Expanded(
  //                           child: Column(
  //                             children: [
  //                               showName(),
  //                               starReview(),
  //                             ],
  //                           ),
  //                         ),
  //                       ],
  //                     ),
  //                   ),
  //                 ),
  //               ],
  //             ),
  //           ),
  //         ],
  //       ),
  //     ),
  //   );
  // }

  // Container img_Profile() {
  //   return Container(
  //     margin: EdgeInsets.only(left: 5),
  //     child: _picture
  //         ? Padding(
  //             padding: const EdgeInsets.only(left: 10),
  //             child: CircleAvatar(
  //               backgroundImage: AssetImage("images/img5.png"),
  //               maxRadius: 35,
  //             ),
  //           )
  //         : Icon(
  //             Icons.account_circle,
  //             size: 70,
  //             color: MyConstant.primary,
  //           ),
  //   );
  // }

  // Container showName() {
  //   return Container(
  //     margin: EdgeInsets.only(left: 5, top: 25),
  //     child: Row(
  //       children: [
  //         Expanded(
  //           child: Text(
  //             _name,
  //             style: MyConstant().h2_Stlye(),
  //             overflow: TextOverflow.ellipsis,
  //           ),
  //         ),
  //       ],
  //     ),
  //   );
  // }

  // Container starReview() {
  //   return Container(
  //     margin: EdgeInsets.only(bottom: 25, top: 5),
  //     child: Row(
  //       children: [
  //         (p >= 0.5)
  //             ? (p >= 1)
  //                 ? Icon(Icons.star, color: Colors.amber[500])
  //                 : Icon(Icons.star_half, color: Colors.amber[500])
  //             : Icon(Icons.star_border, color: Colors.grey),
  //         (p >= 1.5)
  //             ? (p >= 2)
  //                 ? Icon(Icons.star, color: Colors.amber[500])
  //                 : Icon(Icons.star_half, color: Colors.amber[500])
  //             : Icon(Icons.star_border, color: Colors.grey),
  //         (p >= 2.5)
  //             ? (p >= 3)
  //                 ? Icon(Icons.star, color: Colors.amber[500])
  //                 : Icon(Icons.star_half, color: Colors.amber[500])
  //             : Icon(Icons.star_border, color: Colors.grey),
  //         (p >= 3.5)
  //             ? (p >= 4)
  //                 ? Icon(Icons.star, color: Colors.amber[500])
  //                 : Icon(Icons.star_half, color: Colors.amber[500])
  //             : Icon(Icons.star_border, color: Colors.grey),
  //         (p >= 4.5)
  //             ? (p >= 5)
  //                 ? Icon(Icons.star, color: Colors.amber[500])
  //                 : Icon(Icons.star_half, color: Colors.amber[500])
  //             : Icon(Icons.star_border, color: Colors.grey),
  //         Text(
  //           '(' + p.toStringAsFixed(1) + ')',
  //           overflow: TextOverflow.ellipsis,
  //           style: TextStyle(
  //             color: MyConstant.dark,
  //             fontSize: 16,
  //             fontWeight: FontWeight.bold,
  //           ),
  //         ),
  //       ],
  //     ),
  //   );
  // }
/*ฟังก์ชั่นการทำงาน*/
}
