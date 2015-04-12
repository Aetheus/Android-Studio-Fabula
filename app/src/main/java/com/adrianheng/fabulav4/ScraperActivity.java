package com.adrianheng.fabulav4;

import android.app.Activity;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;

import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.TextView;

import com.aedrianheng.utils.MyIOUtil;
import com.aedrianheng.utils.ScraperBottomBarEnablerListener;
import com.aedrianheng.utils.ScraperWebviewFinishLoadingListener;
import com.aedrianheng.utils.web.ScraperWebChromeClient;
import com.aedrianheng.utils.web.ScraperWebViewClient;

import java.io.IOException;
import java.io.InputStream;


public class ScraperActivity extends Activity implements AdapterView.OnItemSelectedListener {

    private static final String TAG ="ScraperActivity";

    private WebView webview;
    private String bookmarklet;

    private String username;
    private String password;

    private String Title = null;
    private String Link = null;
    private String Description = null;
    private String Image = null;

    //should be either Title, Link, Description or Image
    private String CurrentSelectFocus = null;

    private boolean isWebviewLoading = true;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_scraper);

        username = getIntent().getStringExtra("USERNAME");
        password = getIntent().getStringExtra("PASSWORD");
        String initialURL = getIntent().getStringExtra("URL");

        /***********************************************************/
        //load bookmarklet
        try{
            InputStream is = getAssets().open("bookmarklet/bmk.js");
            bookmarklet = MyIOUtil.convertStreamToString(is,"UTF-8");

            Log.i(TAG,"Imported bookmarklet from assets folder");
        }catch (IOException e){
            e.printStackTrace();
        }
        /***********************************************************/


        /***********************************************************/
        //make our display textview scrollable
        TextView tv = (TextView) findViewById(R.id.ScraperSelectedDisplay);
        tv.setMovementMethod(new ScrollingMovementMethod());
        /***********************************************************/


        /***********************************************************/
        //deal with the webview
        webview = (WebView) findViewById(R.id.webView);
        webview.getSettings().setJavaScriptEnabled(true);
        //webview.getSettings().setBuiltInZoomControls(true);

        webview.getSettings().setUserAgentString("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2227.1 Safari/537.36");

        webview.setWebChromeClient(new ScraperWebChromeClient(this));
            ScraperWebViewClient scraperWebViewClient = new ScraperWebViewClient(bookmarklet,username,password, new ScraperBottomBarEnablerListener(this));
            scraperWebViewClient.addListener(new ScraperWebviewFinishLoadingListener(this));
        webview.setWebViewClient(scraperWebViewClient);

        //enable our JS interface
        webview.addJavascriptInterface(this,"FabulaSysApp");

        toggleIsWebviewLoading(true);
        webview.loadUrl(initialURL);
        /***********************************************************/


        /***********************************************************/
        //deal with the spinner
        Spinner spinner = (Spinner) findViewById(R.id.ScraperChoices);
        ArrayAdapter<CharSequence> spinnerAdapter = ArrayAdapter.createFromResource(this,R.array.ScraperChoices,android.R.layout.simple_spinner_dropdown_item);
        spinnerAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        spinner.setAdapter(spinnerAdapter);
        spinner.setOnItemSelectedListener(this);
        toggleBottomBar(false);
        /***********************************************************/
    }

    public void testJSFocusTitle(View view){
        webview = (WebView) findViewById(R.id.webView);
        webview.loadUrl("javascript:$('#FabulaSysLinkButton').click();");
    }



    public void toggleBottomBar(boolean isEnable) {
        View view = (View) findViewById(R.id.ScraperBottomBar);
        view.setEnabled(isEnable);

        ViewGroup viewGroup = (ViewGroup) view;
        for(int i = 0; i< viewGroup.getChildCount(); i++){
            View child = (viewGroup.getChildAt(i));
            child.setEnabled(isEnable);
        }
    }

    public void toggleIsWebviewLoading(boolean isLoading){
        isWebviewLoading = isLoading;
    }


    //when back button called, axe this activity.
    public void onBackButtonClick(View view){
        this.finish();
    }

    public void onSubmitButtonClick(View view){
        webview.loadUrl("javascript:$('#FabulaSubmitButton').click();");
    }

    public void onDeleteButtonClick(View view){

        String virtualButtonPressFunc = "";

        if(CurrentSelectFocus.equals("Title")){
            virtualButtonPressFunc = "$('#FabulaSysDeleteButtonTitle').click();";
        }else if(CurrentSelectFocus.equals("Description")){
            virtualButtonPressFunc = "$('#FabulaSysDeleteButtonDescription').click();";
        }else if(CurrentSelectFocus.equals("Link")){
            virtualButtonPressFunc = "$('#FabulaSysDeleteButtonLink').click();";
        }else if(CurrentSelectFocus.equals("Image")){
            virtualButtonPressFunc = "$('#FabulaSysDeleteButtonImageLink').click();";
        }

        webview.loadUrl("javascript:" + virtualButtonPressFunc);
    }

    public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {
        String selectedOption = (String) parent.getItemAtPosition(pos);
        TextView tv = (TextView) findViewById(R.id.ScraperSelectedDisplay);

        String displayText = "[EMPTY]";
        CurrentSelectFocus = selectedOption;

        //return from function if the webview is still loading
        if(isWebviewLoading){
            tv.setText(displayText);
            return;
        }

        if (selectedOption.equals("Title")){
            displayText = this.Title != null ? this.Title : displayText + " for title";
            webview.loadUrl("javascript:$('#FabulaSysTitleButton').click();");
        }else if (selectedOption.equals("Link")){
            displayText = this.Link != null ? this.Link : displayText + " for link";
            webview.loadUrl("javascript:$('#FabulaSysLinkButton').click();");
        }else if (selectedOption.equals("Description")){
            displayText = this.Description != null ? this.Description : displayText + " for desc";
            webview.loadUrl("javascript:$('#FabulaSysDescriptionButton').click();");
        }else if (selectedOption.equals("Image")){
            displayText = this.Image!= null ? this.Image : displayText + " for image";
            webview.loadUrl("javascript:$('#FabulaSysImageLinkButton').click();");
        }else if (selectedOption.equals("Nothing")){
            displayText = "Use the dropdown to the left to select!";
        }

        tv.setText(displayText);
    }

    public void onNothingSelected(AdapterView<?> parent) {
        // intercae function from onitemselectedlistener.
    }

    @JavascriptInterface
    public void setSelectedDisplayText(String descOfObj, String value){
        TextView tv = (TextView) findViewById(R.id.ScraperSelectedDisplay);
        tv.post(new UpdateSelectedDisplayTask(descOfObj,value,tv));
    }

    private class UpdateSelectedDisplayTask implements Runnable {
        String descOfObj;
        String value;
        TextView tv;

        public UpdateSelectedDisplayTask(String descOfObj,String value, TextView tv){
            super();
            this.descOfObj = descOfObj;
            this.value = value;
            this.tv = tv;
        }

        @Override
        public void run() {
            if(descOfObj.equals("title")){
                Title = value!=null ? value : "[EMPTY]";
                tv.setText(Title);
            }else if(descOfObj.equals("desc")){
                Description = value!=null ? value : "[EMPTY]";;
                tv.setText(Description);
            }else if(descOfObj.equals("link")){
                Link = value!=null ? value : "[EMPTY]";;
                tv.setText(Link);
            }else if(descOfObj.equals("imagelink")){
                Image = value!=null ? value : "[EMPTY]";;
                tv.setText(Image);
            }
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_scraper, menu);
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
