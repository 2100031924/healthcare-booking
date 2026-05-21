$updated = @('Header.scss', 'Sidebar.scss', 'Layout.scss', 'DashboardPage.scss', 'LoginPage.scss', 'RegisterPage.scss', 'DoctorBookingPage.scss', 'App.scss', 'DoctorCard.scss')
$snippet = @"

/* Extra small screen adjustments */
@media (max-width: 480px) {
  .page, .container, .section { padding: 1rem 0.75rem; }
  h1, h2, h3 { font-size: clamp(1rem, 2vw, 1.5rem); }
}
"@
Get-ChildItem -Path 'src' -Filter '*.scss' -Recurse | Where-Object {
    $_.Name -notin $updated
} | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    if (-not ($content -match 'Extra small screen adjustments')) {
        if ($content.TrimEnd().EndsWith('}')) {
            Add-Content $_.FullName $snippet
            Write-Host "Updated: $($_.FullName)"
        } else {
            Write-Host "Skipped (does not end with }): $($_.FullName)"
        }
    } else {
        Write-Host "Skipped (already updated): $($_.FullName)"
    }
}