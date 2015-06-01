package com.adrianheng.fabulav4;

import android.app.Activity;
import android.content.ClipData;
import android.content.Intent;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.content.ClipboardManager;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.webkit.WebView;
import android.widget.Toast;

import com.aedrianheng.utils.htmlApp.ExternalPageWebViewClient;
import com.aedrianheng.utils.htmlApp.LandingWebViewClient;
import com.aedrianheng.utils.web.ScraperWebChromeClient;




public class ExternalPreview extends Activity {

    private static final String tag = "ExternalPreview";

    private String externalURL;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_external_preview);

        Intent intent = getIntent();
        String url = intent.getStringExtra("url");
        externalURL = url;

        WebView landingWebview = (WebView) findViewById(R.id.ExternalPreviewWebView);
        landingWebview.getSettings().setJavaScriptEnabled(true);
        landingWebview.setWebViewClient(new ExternalPageWebViewClient());
        landingWebview.setWebChromeClient(new ScraperWebChromeClient(this));

        landingWebview.loadUrl(url);
        Toast toast = Toast.makeText(this, "loading site ...", Toast.LENGTH_SHORT);
        toast.show();
    }


    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_external_preview, menu);
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

    public void clipboardCopy(View view){
        try {
            ClipboardManager clipboard = (ClipboardManager) getSystemService(CLIPBOARD_SERVICE);
            ClipData clip = ClipData.newPlainText("Copied text", externalURL);
            clipboard.setPrimaryClip(clip);

            Toast toast = Toast.makeText(this, "copied to clipboard", Toast.LENGTH_SHORT);
            toast.show();
        }catch(Exception e){
            Log.e(tag,"Error occured: " + e);
        }
    }

    public void onBackButtonClick(View view) {
        finish();
    }
}
