import 'dart:ui';

import 'package:flutter/material.dart';

class MyConstant {
  //appName
  static String appName = 'Driver App';

  // color
  static Color primary = Color(0xff24a7aa);
  static Color dark = Color(0xff00777b);
  static Color light = Color(0xff64d9dc);
  static Color red1 = Color(0xffb71c1c);
  static Color red2 = Color(0xff9a0007);
  static Color green1 = Color(0xff005005);
  static Color blue = Color(0xff34515e);

  //style
  TextStyle h1_Stlye() => TextStyle(
        fontSize: 24,
        color: primary,
        fontWeight: FontWeight.bold,
      );
  TextStyle h2_Stlye() => TextStyle(
        fontSize: 18,
        color: dark,
        fontWeight: FontWeight.w700,
      );
  TextStyle h3_Stlye() => TextStyle(
        fontSize: 14,
        color: light,
        fontWeight: FontWeight.normal,
      );

  //button style
  ButtonStyle MyButtonStlye() => ElevatedButton.styleFrom(
        primary: MyConstant.green1,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      );
  ButtonStyle MyButtonStlye1() => ElevatedButton.styleFrom(
        primary: MyConstant.red2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      );
  ButtonStyle MyButtonStlye2() => ElevatedButton.styleFrom(
        primary: MyConstant.primary,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
      );
}
