package com.tippulse.app;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;
import com.google.firebase.messaging.FirebaseMessaging;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            // Automatically subscribe device to 'all' topic for broadcast notifications
            FirebaseMessaging.getInstance().subscribeToTopic("all");
        } catch (Exception e) {
            // Safe fallback if Firebase is not initialized
        }
    }
}
