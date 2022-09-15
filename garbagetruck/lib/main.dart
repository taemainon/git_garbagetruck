import 'package:flutter/material.dart';
import 'package:garbagetruck/modules/screen/history_screen.dart';
import 'package:garbagetruck/modules/screen/profile.dart';
import 'package:garbagetruck/modules/screen/test.dart';

import 'package:provider/provider.dart';

import 'modules/core/managers/MQTTManager.dart';
import 'modules/helpers/screen_route.dart';
import 'modules/helpers/service_locator.dart';
import 'modules/screen/login_screen.dart';
import 'modules/screen/map_screen.dart';
import 'modules/screen/weigh_screen.dart';
//import 'modules/widgets/show_icon_button.dart';

void main() {
  setupLocator();
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider<MQTTManager>(
      create: (context) => service_locator<MQTTManager>(),
      child: MaterialApp(
          title: 'Driver App',
          theme: ThemeData(
            // This is the theme of your application.
            //
            // Try running your application with "flutter run". You'll see the
            // application has a blue toolbar. Then, without quitting the app, try
            // changing the primarySwatch below to Colors.green and then invoke
            // "hot reload" (press "r" in the console where you ran "flutter run",
            // or simply save your changes to "hot reload" in a Flutter IDE).
            // Notice that the counter didn't reset back to zero; the application
            // is not restarted.
            primarySwatch: Colors.blue,
            // This makes the visual density adapt to the platform that you run
            // the app on. For desktop platforms, the controls will be smaller and
            // closer together (more dense) than on mobile platforms.
            visualDensity: VisualDensity.adaptivePlatformDensity,
          ),
          initialRoute: '/login',
          routes: {
            '/login': (BuildContext context) => login(),
            '/map': (BuildContext context) => MapScreen(),
            '/profile': (BuildContext context) => profileScreen(),
            '/hist': (BuildContext context) => historyScreen(),
            '/weigh': (BuildContext context) => WeighScreen(),
            //'/test': (BuildContext context) => test(),
          }),
    );
  }
}
