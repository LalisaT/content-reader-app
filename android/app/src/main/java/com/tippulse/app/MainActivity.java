package com.tippulse.app;

import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import androidx.activity.EdgeToEdge;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            // Enable official AndroidX EdgeToEdge backward compatibility for all Android versions
            EdgeToEdge.enable(this);
        } catch (Exception ignored) {}

        super.onCreate(savedInstanceState);

        try {
            Window window = getWindow();
            if (window != null) {
                window.setFlags(
                    WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
                    WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
                );
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    window.setNavigationBarContrastEnforced(true);
                }
            }

            // On Android < 15 (where Capacitor's SystemBars does not pad the parent ViewGroup),
            // apply WindowInsets padding to android.R.id.content so EdgeToEdge never overlaps
            // the 3-button navigation bar or top status bar.
            if (Build.VERSION.SDK_INT < Build.VERSION_CODES.VANILLA_ICE_CREAM) {
                View contentView = findViewById(android.R.id.content);
                if (contentView != null) {
                    ViewCompat.setOnApplyWindowInsetsListener(contentView, (v, windowInsets) -> {
                        Insets systemBars = windowInsets.getInsets(
                            WindowInsetsCompat.Type.systemBars() | WindowInsetsCompat.Type.displayCutout()
                        );
                        Insets imeInsets = windowInsets.getInsets(WindowInsetsCompat.Type.ime());
                        boolean imeVisible = windowInsets.isVisible(WindowInsetsCompat.Type.ime());
                        v.setPadding(
                            systemBars.left,
                            systemBars.top,
                            systemBars.right,
                            imeVisible ? imeInsets.bottom : systemBars.bottom
                        );
                        return windowInsets;
                    });
                }
            }
        } catch (Exception ignored) {}
    }
}
