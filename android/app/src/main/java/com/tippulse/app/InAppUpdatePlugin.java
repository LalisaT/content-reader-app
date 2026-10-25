package com.tippulse.app;

import android.app.Activity;
import android.content.Intent;
import android.content.IntentSender;
import androidx.activity.result.ActivityResult;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.google.android.play.core.appupdate.AppUpdateInfo;
import com.google.android.play.core.appupdate.AppUpdateManager;
import com.google.android.play.core.appupdate.AppUpdateManagerFactory;
import com.google.android.play.core.appupdate.AppUpdateOptions;
import com.google.android.play.core.install.InstallState;
import com.google.android.play.core.install.InstallStateUpdatedListener;
import com.google.android.play.core.install.model.AppUpdateType;
import com.google.android.play.core.install.model.InstallStatus;
import com.google.android.play.core.install.model.UpdateAvailability;

@CapacitorPlugin(name = "InAppUpdate")
public class InAppUpdatePlugin extends Plugin {

    private AppUpdateManager appUpdateManager;
    private AppUpdateInfo currentAppUpdateInfo;
    private InstallStateUpdatedListener installStateUpdatedListener;

    @Override
    public void load() {
        super.load();
        try {
            appUpdateManager = AppUpdateManagerFactory.create(getContext());
            installStateUpdatedListener = new InstallStateUpdatedListener() {
                @Override
                public void onStateUpdate(InstallState state) {
                    JSObject ret = new JSObject();
                    ret.put("installStatus", state.installStatus());
                    ret.put("bytesDownloaded", state.bytesDownloaded());
                    ret.put("totalBytesToDownload", state.totalBytesToDownload());

                    if (state.installStatus() == InstallStatus.DOWNLOADING) {
                        notifyListeners("updateProgress", ret);
                    } else if (state.installStatus() == InstallStatus.DOWNLOADED) {
                        notifyListeners("updateDownloaded", ret);
                    } else if (state.installStatus() == InstallStatus.FAILED) {
                        notifyListeners("updateFailed", ret);
                    }
                }
            };
            appUpdateManager.registerListener(installStateUpdatedListener);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @PluginMethod
    public void checkUpdate(PluginCall call) {
        if (appUpdateManager == null) {
            JSObject res = new JSObject();
            res.put("updateAvailable", false);
            res.put("error", "AppUpdateManager not initialized");
            call.resolve(res);
            return;
        }

        appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
            currentAppUpdateInfo = appUpdateInfo;
            JSObject res = new JSObject();
            boolean isAvailable = appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE;
            boolean isFlexible = appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE);
            boolean isImmediate = appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.IMMEDIATE);
            boolean isDownloaded = appUpdateInfo.installStatus() == InstallStatus.DOWNLOADED;

            res.put("updateAvailable", isAvailable);
            res.put("flexibleAllowed", isFlexible);
            res.put("immediateAllowed", isImmediate);
            res.put("isDownloaded", isDownloaded);
            res.put("availableVersionCode", appUpdateInfo.availableVersionCode());
            res.put("installStatus", appUpdateInfo.installStatus());
            call.resolve(res);
        }).addOnFailureListener(e -> {
            JSObject res = new JSObject();
            res.put("updateAvailable", false);
            res.put("error", e.getMessage());
            call.resolve(res);
        });
    }

    @PluginMethod
    public void startFlexibleUpdate(PluginCall call) {
        if (appUpdateManager == null) {
            call.reject("AppUpdateManager not initialized");
            return;
        }

        if (currentAppUpdateInfo == null) {
            // Fetch info first
            appUpdateManager.getAppUpdateInfo().addOnSuccessListener(appUpdateInfo -> {
                currentAppUpdateInfo = appUpdateInfo;
                launchFlexibleFlow(call);
            }).addOnFailureListener(e -> call.reject("Failed to get update info: " + e.getMessage()));
            return;
        }

        launchFlexibleFlow(call);
    }

    private void launchFlexibleFlow(PluginCall call) {
        try {
            if (currentAppUpdateInfo.installStatus() == InstallStatus.DOWNLOADED) {
                JSObject ret = new JSObject();
                ret.put("status", "already_downloaded");
                call.resolve(ret);
                notifyListeners("updateDownloaded", new JSObject());
                return;
            }

            if (currentAppUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)) {
                AppUpdateOptions options = AppUpdateOptions.newBuilder(AppUpdateType.FLEXIBLE).build();
                appUpdateManager.startUpdateFlowForResult(
                    currentAppUpdateInfo,
                    getActivity(),
                    options,
                    1999
                );
                JSObject ret = new JSObject();
                ret.put("status", "started");
                call.resolve(ret);
            } else {
                call.reject("Flexible update not allowed for this release");
            }
        } catch (IntentSender.SendIntentException e) {
            call.reject("IntentSender failed: " + e.getMessage());
        } catch (Exception e) {
            call.reject("Failed to start flexible update: " + e.getMessage());
        }
    }

    @PluginMethod
    public void completeUpdate(PluginCall call) {
        if (appUpdateManager == null) {
            call.reject("AppUpdateManager not initialized");
            return;
        }

        try {
            appUpdateManager.completeUpdate();
            JSObject res = new JSObject();
            res.put("status", "completing");
            call.resolve(res);
        } catch (Exception e) {
            call.reject("Failed to complete update: " + e.getMessage());
        }
    }

    @Override
    protected void handleOnDestroy() {
        super.handleOnDestroy();
        if (appUpdateManager != null && installStateUpdatedListener != null) {
            appUpdateManager.unregisterListener(installStateUpdatedListener);
        }
    }
}
