import 'package:flutter/material.dart';

class ShowProgress extends StatelessWidget {
  ShowProgress({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      child: CircularProgressIndicator(),
    );
  }
}
