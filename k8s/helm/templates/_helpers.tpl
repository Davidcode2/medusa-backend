{{/*
Expand the name of the chart.
*/}}
{{- define "medusa-backend.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "medusa-backend.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "medusa-backend.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "medusa-backend.labels" -}}
helm.sh/chart: {{ include "medusa-backend.chart" . }}
{{ include "medusa-backend.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "medusa-backend.selectorLabels" -}}
app.kubernetes.io/name: {{ include "medusa-backend.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "medusa-backend.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "medusa-backend.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Database URL
*/}}
{{- define "medusa-backend.databaseUrl" -}}
{{- printf "postgres://%s:$(POSTGRES_PASSWORD)@%s-postgres:%d/%s" .Values.postgres.user (include "medusa-backend.fullname" .) (int .Values.postgres.service.port) .Values.postgres.database }}
{{- end }}

{{/*
Redis URL
*/}}
{{- define "medusa-backend.redisUrl" -}}
{{- printf "redis://%s-redis:%d" (include "medusa-backend.fullname" .) (int .Values.redis.service.port) }}
{{- end }}
