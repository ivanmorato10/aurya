// AURYA · tokens para o app Flutter (espelho de src/styles/tokens.css).
// Ainda não integrado ao código em legacy/native: usar quando o app nativo for retomado.
import 'package:flutter/material.dart';

abstract final class AuryaColors {
  static const midnightNavy = Color(0xFF101C2C);
  static const oceanBlue = Color(0xFF1E3A5F);
  static const champagne = Color(0xFFC5B69A);
  static const ivory = Color(0xFFF4F0E8);
  static const ivoryMuted = Color(0xA3F4F0E8); // 64%
  static const border = Color(0x1FF4F0E8); // 12%
  static const error = Color(0xFFE8A39A);
}

abstract final class AuryaSpacing {
  static const s1 = 4.0, s2 = 8.0, s3 = 12.0, s4 = 16.0, s5 = 20.0, s6 = 24.0, s8 = 32.0, s10 = 40.0, s12 = 48.0;
  static const gutter = 24.0;
  static const touch = 48.0;
}

/// Cormorant Garamond (editorial) e Inter (interface), via google_fonts ou assets (OFL).
abstract final class AuryaType {
  static const editorial = 'Cormorant Garamond';
  static const ui = 'Inter';
  static const display = TextStyle(fontFamily: editorial, fontSize: 40, height: 1.12, color: AuryaColors.ivory);
  static const headline = TextStyle(fontFamily: editorial, fontSize: 32, height: 1.15, color: AuryaColors.ivory);
  static const title = TextStyle(fontFamily: editorial, fontSize: 22, fontWeight: FontWeight.w500, height: 1.25);
  static const body = TextStyle(fontFamily: ui, fontSize: 16, height: 1.6);
  static const caption = TextStyle(fontFamily: ui, fontSize: 13, height: 1.45, color: AuryaColors.ivoryMuted);
  static const overline = TextStyle(fontFamily: ui, fontSize: 11, fontWeight: FontWeight.w500, letterSpacing: 2.4);
  static const button = TextStyle(fontFamily: ui, fontSize: 16, fontWeight: FontWeight.w500);
  static const nav = TextStyle(fontFamily: ui, fontSize: 11, fontWeight: FontWeight.w500);
}
