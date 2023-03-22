import Script from 'next/script'

export function Analytics() {
	return (
		<>
			<Script async src="https://www.googletagmanager.com/gtag/js?id=G-5TV525SXSJ"></Script>
			<Script id="google-analytics" strategy="afterInteractive">
				{`
				window.dataLayer = window.dataLayer || [];
				function gtag(){dataLayer.push(arguments);}
				gtag('js', new Date());
				gtag('config', 'G-5TV525SXSJ');
	        `}
			</Script>
			<Script src="https://www.google-analytics.com/analytics.js" strategy="afterInteractive" />
		</>
	)
}
