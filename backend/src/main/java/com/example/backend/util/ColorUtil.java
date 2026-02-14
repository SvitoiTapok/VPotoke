package com.example.backend.util;
import java.awt.Color;
import java.util.Random;

public class ColorUtil {

    private static final Random random = new Random();

    public static String randomNiceColor() {
        float hue = random.nextFloat();
        float saturation = 0.7f + random.nextFloat() * 0.3f;
        float lightness = 0.45f + random.nextFloat() * 0.15f;

        Color color = hslToRgb(hue, saturation, lightness);
        return String.format("#%02X%02X%02X",
                color.getRed(),
                color.getGreen(),
                color.getBlue());
    }

    private static Color hslToRgb(float h, float s, float l) {
        float c = (1 - Math.abs(2 * l - 1)) * s;
        float x = c * (1 - Math.abs((h * 6) % 2 - 1));
        float m = l - c / 2;

        float r=0,g=0,b=0;

        if (h < 1f/6)      { r=c; g=x; b=0; }
        else if (h < 2f/6){ r=x; g=c; b=0; }
        else if (h < 3f/6){ r=0; g=c; b=x; }
        else if (h < 4f/6){ r=0; g=x; b=c; }
        else if (h < 5f/6){ r=x; g=0; b=c; }
        else              { r=c; g=0; b=x; }

        return new Color(
                Math.round((r + m) * 255),
                Math.round((g + m) * 255),
                Math.round((b + m) * 255)
        );
    }
}