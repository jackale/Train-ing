// Upgrade NOTE: replaced 'mul(UNITY_MATRIX_MVP,*)' with 'UnityObjectToClipPos(*)'

Shader "Custom/Animation" {
	Properties {
		_Color ("Color", Color) = (0,0,0,1)
		_MainTex("Texture", 2D) = "white"{}
	}
	SubShader {
		Tags { "RenderType"="Opaque" }
		LOD 200
		
		CGPROGRAM
		// Physically based Standard lighting model, and enable shadows on all light types
		#pragma surface surf Standard fullforwardshadows

		// Use shader model 3.0 target, to get nicer looking lighting
		#pragma target 3.0

		sampler2D _MainTex;
		fixed4 _Color;

		struct Input {
			float2 uv_MainTex;
		};

		struct v2f {
            float4 pos : SV_POSITION;
            float2 uv : TEXCOORD0;
        };

		v2f vert(appdata_full v)
        {
            v2f o;
            o.uv = v.texcoord.xy;
            o.pos = UnityObjectToClipPos(v.vertex);
            return o;
        }

		void surf (Input IN, inout SurfaceOutputStandard o) {
			fixed4 c = tex2D(_MainTex, IN.uv_MainTex);
			o.Albedo = _Color * (fixed4(1,1,1,0) - c);
		}
		ENDCG
	}
	FallBack "Diffuse"
}
