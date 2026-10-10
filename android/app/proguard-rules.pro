# Add project specific ProGuard / R8 rules here.
# Enables full DEX optimization & obfuscation (>25% Play Console requirement)
# while preserving Capacitor, WebView JS interfaces, and AdMob reflection classes.

# Keep line number information for Play Console crash symbolication
-keepattributes SourceFile,LineNumberTable
-renamesourcefileattribute SourceFile
-keepattributes *Annotation*,InnerClasses,Signature,EnclosingMethod

# Keep MainActivity and Capacitor core bridge & plugin reflection classes
-keep class com.tippulse.app.** { *; }
-keep class com.getcapacitor.** { *; }
-keep interface com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep @com.getcapacitor.NativePlugin class * { *; }
-keepclassmembers class * extends com.getcapacitor.Plugin {
    @com.getcapacitor.PluginMethod <methods>;
    public <init>(...);
}

# Keep Capacitor community & third-party plugins (AdMob, SplashScreen, Network, Share, App)
-keep class com.getcapacitor.community.admob.** { *; }
-keep class com.capacitorjs.plugins.** { *; }
-keep class org.apache.cordova.** { *; }

# Keep WebView JavaScript Interfaces
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}

# Keep Google Mobile Ads / AdMob public entrypoints
-keep public class com.google.android.gms.ads.** {
    public *;
}
-dontwarn com.google.errorprone.annotations.**
-dontwarn javax.annotation.**
