package com.aedrianheng.utils;

import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

/**
 * Created by Adrian on 9/4/2015.
 */
public class MyIOUtil {

    public static String convertStreamToString(java.io.InputStream is, String charset) {
        java.util.Scanner s = new java.util.Scanner(is, charset).useDelimiter("\\A");
        return s.hasNext() ? s.next() : "";
    }
}
