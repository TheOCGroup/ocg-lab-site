$ErrorActionPreference = 'Stop'
$project = 'ocg-pipeline'
$service = 'ocg-os-canonical-reader-staging'
$region = 'us-central1'
$reader = 'ocg-os-canonical-reader@ocg-pipeline.iam.gserviceaccount.com'
$object = 'projects/_/buckets/ocg-pipeline-reactor-assets/objects/os/canonical_state.json'
$run = gcloud run services describe $service --project $project --region $region --format=json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'Cloud Run lookup failed' }
$ready = @($run.status.conditions | Where-Object { $_.type -eq 'Ready' -and $_.status -eq 'True' })
if ($ready.Count -ne 1) { throw 'Cloud Run is not Ready' }
if ($run.metadata.annotations.'run.googleapis.com/ingress' -ne 'internal') { throw 'Ingress must remain internal' }
if ($run.spec.template.spec.serviceAccountName -ne $reader) { throw 'Unexpected runtime identity' }
$runPolicy = gcloud run services get-iam-policy $service --project $project --region $region --format=json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'Run IAM lookup failed' }
$public = @($runPolicy.bindings | Where-Object { $_.members -contains 'allUsers' -or $_.members -contains 'allAuthenticatedUsers' })
if ($public.Count -gt 0) { throw 'Public Cloud Run IAM binding detected' }
$bucket = gcloud storage buckets get-iam-policy gs://ocg-pipeline-reactor-assets --format=json | ConvertFrom-Json
if ($LASTEXITCODE -ne 0) { throw 'Bucket IAM lookup failed' }
$bindings = @($bucket.bindings | Where-Object { $_.members -contains ('serviceAccount:' + $reader) })
if ($bindings.Count -ne 1) { throw 'Expected exactly one bucket IAM binding' }
if ($bindings[0].role -ne 'roles/storage.objectViewer') { throw 'Reader has unexpected bucket role' }
if ($bindings[0].condition.expression -ne ("resource.name == '" + $object + "'")) { throw 'Reader must be restricted to exact canonical object' }
Write-Output 'PASS: Cloud Run ready, internal ingress, dedicated reader, no public invoker, exact-object viewer binding.'
Write-Output 'NOT TESTED: live authenticated object read and Firebase frontend integration.'
