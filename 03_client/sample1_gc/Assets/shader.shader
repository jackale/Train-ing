﻿Shader "Transparent/Diffuse ZWrite2" {
    Properties {
        _Color ("Main Color", Color) = (1,1,1,0.5)
        _MainTex ("Base (RGB) Trans (A)", 2D) = "white" {}
    }

    SubShader {
        Tags {"Queue"="Transparent-1" "IgnoreProjector"="True" "RenderType"="Transparent"}
        LOD 200

        ZTest Always
        // extra pass that renders to depth buffer only
        Pass {
            ZWrite Off
            ColorMask 0
        }

        // paste in forward rendering passes from Transparent/Diffuse
        UsePass "Transparent/Diffuse/FORWARD"
    }

    Fallback "Transparent/VertexLit"
}