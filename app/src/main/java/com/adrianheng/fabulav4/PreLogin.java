package com.adrianheng.fabulav4;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import com.aedrianheng.utils.htmlApp.LandingWebViewClient;
import com.aedrianheng.utils.web.ScraperWebChromeClient;


public class PreLogin extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_pre_login);
        //get the intent that started tbis activity, and extract the sent USERNAME and PASSWORD from it

        //get the mode: either "register" or "reset"
        Intent ourStarter = getIntent();
        String mode = ourStarter.getStringExtra("mode");

        WebView landingWebview = (WebView) findViewById(R.id.prewebview);
        landingWebview.getSettings().setJavaScriptEnabled(true);
        landingWebview.setWebChromeClient(new ScraperWebChromeClient(this));
        landingWebview.addJavascriptInterface(this,"FabulaSysApp");

        if(mode.equals("register")){
            landingWebview.loadUrl("file:///android_asset/htmlApp/register.html");
        }else{
            landingWebview.loadUrl("file:///android_asset/htmlApp/pwreset.html");
        }
    }

    @JavascriptInterface
    public void closeActivity(){
        finish();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_pre_login, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }
}
