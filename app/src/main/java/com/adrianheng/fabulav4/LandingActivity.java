package com.adrianheng.fabulav4;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.TextView;

import com.aedrianheng.utils.htmlApp.LandingWebViewClient;
import com.aedrianheng.utils.web.ScraperWebChromeClient;


public class LandingActivity extends Activity {

    protected String username;
    protected String password;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_landing);

        Intent ourStarter = getIntent();
        this.username = ourStarter.getStringExtra("USERNAME");
        this.password = ourStarter.getStringExtra("PASSWORD");

        WebView landingWebview = (WebView) findViewById(R.id.landingWebview);
        landingWebview.getSettings().setJavaScriptEnabled(true);
        landingWebview.setWebViewClient(new LandingWebViewClient(username, password));
        landingWebview.setWebChromeClient(new ScraperWebChromeClient(this));
        landingWebview.addJavascriptInterface(this,"FabulaSysApp");

        landingWebview.loadUrl("file:///android_asset/htmlApp/index.html");

        //TextView mainMessage = (TextView) findViewById(R.id.landingMessage);
        //mainMessage.setText(username + " : " + password);
    }

    @JavascriptInterface
    public void goToScraper(String url){
        Intent intent = new Intent(this,ScraperActivity.class);
        intent.putExtra("USERNAME", username);
        intent.putExtra("PASSWORD", password);
        intent.putExtra("URL", url);
        //intent.putExtra("URL", "http://webspace.apiit.edu.my/");

        runOnUiThread(new LaunchScraper(intent,this));
    }


    @JavascriptInterface
    public void signOut(){
        SharedPreferences sharedPreferences = this.getSharedPreferences(this.getString(R.string.preference_file_key), Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.remove("username");
        editor.remove("password");
        editor.commit();
        this.finish();
    }


    private class LaunchScraper implements Runnable {
        Intent intent;
        Context context;

        public LaunchScraper(Intent intent, Context context){
            super();
            this.intent = intent;
            this.context = context;
        }

        @Override
        public void run() {
            context.startActivity(intent);
        }
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_landing, menu);
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
