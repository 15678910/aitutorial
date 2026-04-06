export interface PythonExercise {
  title: string
  description: string
  initialCode: string
  expectedOutput: string
  hint: string
  packages: string[]
}

export const pythonExercises: Record<string, PythonExercise> = {
  // ═══════════════════════════════════════════
  // CH1: Python 기초와 데이터 다루기
  // ═══════════════════════════════════════════

  'python-ml-practice-ch1-s1': {
    title: 'Python 기본 문법 실습',
    description: '변수, 자료형, 조건문, 반복문을 활용하여 1부터 10까지 짝수의 합을 구해보세요.',
    initialCode: `# 1부터 10까지 짝수의 합을 구하세요
# TODO: for 반복문과 if 조건문을 사용하세요

total = 0

# 여기에 코드를 작성하세요


print(total)`,
    expectedOutput: '30',
    hint: 'for i in range(1, 11): 로 반복하고, if i % 2 == 0: 으로 짝수를 판별하세요.',
    packages: [],
  },

  'python-ml-practice-ch1-s2': {
    title: '함수 정의 실습',
    description: '리스트의 평균을 구하는 함수를 만들고, map과 filter를 활용해보세요.',
    initialCode: `# 1. 리스트의 평균을 구하는 함수를 만드세요
def average(numbers):
    # TODO: 리스트의 평균을 반환하세요
    pass

# 2. 1~10 중 홀수만 필터링하세요
numbers = list(range(1, 11))
odd_numbers = list(filter(lambda x: x % 2 != 0, numbers))

# 3. 각 홀수를 제곱하세요
squared = list(map(lambda x: x ** 2, odd_numbers))

print(average([10, 20, 30, 40, 50]))
print(squared)`,
    expectedOutput: '30.0\n[1, 9, 25, 49, 81]',
    hint: 'average 함수에서 return sum(numbers) / len(numbers) 를 사용하세요.',
    packages: [],
  },

  'python-ml-practice-ch1-s3': {
    title: '데이터 구조 실습',
    description: '딕셔너리 리스트에서 특정 조건의 데이터를 추출하고 정렬해보세요.',
    initialCode: `# 학생 성적 데이터
students = [
    {"name": "김민수", "score": 85},
    {"name": "이지은", "score": 92},
    {"name": "박서준", "score": 78},
    {"name": "최영희", "score": 95},
    {"name": "정대현", "score": 88},
]

# TODO: 점수가 85 이상인 학생만 필터링하세요
top_students = []

# TODO: 점수 기준 내림차순 정렬하세요
top_students.sort(key=lambda x: x["score"], reverse=True)

# 이름만 출력
for s in top_students:
    print(s["name"], s["score"])`,
    expectedOutput: '최영희 95\n이지은 92\n정대현 88\n김민수 85',
    hint: 'top_students = [s for s in students if s["score"] >= 85] 리스트 컴프리헨션을 사용하세요.',
    packages: [],
  },

  // ═══════════════════════════════════════════
  // CH2: NumPy와 Pandas 마스터
  // ═══════════════════════════════════════════

  'python-ml-practice-ch2-s1': {
    title: 'NumPy 배열 실습',
    description: 'NumPy 배열을 생성하고 기본 연산과 인덱싱을 연습해보세요.',
    initialCode: `import numpy as np

# 1. 1부터 9까지 3x3 행렬 만들기
matrix = np.arange(1, 10).reshape(3, 3)
print("행렬:")
print(matrix)

# 2. 행렬의 각 행의 합 구하기
row_sums = np.sum(matrix, axis=1)
print("행 합:", row_sums)

# 3. TODO: 행렬에서 5보다 큰 원소만 추출하세요
big_values = []  # 수정하세요
print("5보다 큰 값:", big_values)`,
    expectedOutput: '행렬:\n[[1 2 3]\n [4 5 6]\n [7 8 9]]\n행 합: [ 6 15 24]\n5보다 큰 값: [6 7 8 9]',
    hint: 'big_values = matrix[matrix > 5] 불리언 인덱싱을 사용하세요.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch2-s2': {
    title: 'Pandas DataFrame 실습',
    description: 'DataFrame을 생성하고 기본 조작을 해보세요.',
    initialCode: `import pandas as pd

# 데이터 생성
data = {
    "이름": ["김철수", "이영희", "박지민", "최수진"],
    "나이": [25, 30, 28, 35],
    "점수": [85, 92, 78, 95],
}
df = pd.DataFrame(data)

# 1. 점수 기준 내림차순 정렬
df_sorted = df.sort_values("점수", ascending=False)
print(df_sorted.to_string(index=False))

# 2. TODO: 나이가 28 이상인 행만 필터링하세요
filtered = df  # 수정하세요
print("\\n28세 이상:")
print(filtered["이름"].tolist())`,
    expectedOutput: ' 이름  나이  점수\n최수진  35  95\n이영희  30  92\n김철수  25  85\n박지민  28  78\n\n28세 이상:\n[\'이영희\', \'박지민\', \'최수진\']',
    hint: 'filtered = df[df["나이"] >= 28] 조건 필터링을 사용하세요.',
    packages: ['pandas'],
  },

  'python-ml-practice-ch2-s3': {
    title: '데이터 전처리 실습',
    description: '결측치 처리와 데이터 변환을 연습해보세요.',
    initialCode: `import pandas as pd
import numpy as np

# 결측치가 있는 데이터
data = {
    "과목": ["수학", "영어", "과학", "국어", "사회"],
    "점수": [85, np.nan, 92, np.nan, 78],
}
df = pd.DataFrame(data)

# 1. 결측치 개수 확인
print("결측치 수:", df["점수"].isna().sum())

# 2. TODO: 결측치를 평균값으로 채우세요
mean_score = df["점수"].mean()
df["점수"] = df["점수"].fillna(mean_score)

# 3. 결과 출력
print("평균:", mean_score)
print("채운 후:", df["점수"].tolist())`,
    expectedOutput: '결측치 수: 2\n평균: 85.0\n채운 후: [85.0, 85.0, 92.0, 85.0, 78.0]',
    hint: 'mean()은 NaN을 자동으로 제외하고 계산합니다. fillna()로 결측치를 채울 수 있습니다.',
    packages: ['pandas', 'numpy'],
  },

  // ═══════════════════════════════════════════
  // CH3: 데이터 시각화
  // ═══════════════════════════════════════════

  'python-ml-practice-ch3-s1': {
    title: 'Matplotlib 데이터 준비',
    description: '차트에 사용할 데이터를 생성하고 통계값을 계산해보세요.',
    initialCode: `import numpy as np

# 시뮬레이션 데이터 생성 (시드 고정)
np.random.seed(42)
scores = np.random.normal(loc=75, scale=10, size=100)
scores = np.clip(scores, 0, 100).astype(int)

# 기본 통계
print("평균:", round(np.mean(scores), 1))
print("표준편차:", round(np.std(scores), 1))
print("최소:", np.min(scores))
print("최대:", np.max(scores))

# TODO: 80점 이상인 학생 수를 구하세요
above_80 = 0  # 수정하세요
print("80점 이상:", above_80, "명")`,
    expectedOutput: '평균: 74.8\n표준편차: 9.7\n최소: 49\n최대: 97\n80점 이상: 30 명',
    hint: 'above_80 = np.sum(scores >= 80) 또는 len(scores[scores >= 80])을 사용하세요.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch3-s2': {
    title: '데이터 변환과 구간 분류',
    description: '점수 데이터를 구간별로 분류하고 빈도를 계산해보세요.',
    initialCode: `import numpy as np

np.random.seed(42)
scores = np.random.normal(loc=75, scale=10, size=100).astype(int)
scores = np.clip(scores, 0, 100)

# TODO: 점수를 등급으로 변환하세요
# 90 이상: A, 80 이상: B, 70 이상: C, 60 이상: D, 나머지: F
grades = []
for s in scores:
    if s >= 90:
        grades.append("A")
    elif s >= 80:
        grades.append("B")
    elif s >= 70:
        grades.append("C")
    elif s >= 60:
        grades.append("D")
    else:
        grades.append("F")

# 등급별 인원 수 (정렬하여 출력)
from collections import Counter
counts = Counter(grades)
for grade in ["A", "B", "C", "D", "F"]:
    print(f"{grade}: {counts.get(grade, 0)}명")`,
    expectedOutput: 'A: 5명\nB: 25명\nC: 37명\nD: 23명\nF: 10명',
    hint: '각 조건을 if/elif/else로 분기하여 등급을 부여합니다.',
    packages: ['numpy'],
  },

  'python-ml-practice-ch3-s3': {
    title: 'EDA 통계 분석',
    description: 'DataFrame의 기술 통계량과 상관관계를 분석해보세요.',
    initialCode: `import numpy as np
import pandas as pd

np.random.seed(42)

# 학생 성적 데이터 생성
n = 50
data = {
    "수학": np.random.normal(75, 10, n).astype(int),
    "영어": np.random.normal(80, 8, n).astype(int),
    "과학": np.random.normal(70, 12, n).astype(int),
}
df = pd.DataFrame(data)

# 1. 각 과목 평균
print("과목별 평균:")
print(df.mean().round(1).to_string())

# 2. TODO: 수학-영어 상관계수를 구하세요
corr = 0.0  # 수정하세요
print(f"\\n수학-영어 상관계수: {round(corr, 3)}")`,
    expectedOutput: '과목별 평균:\n수학    74.9\n영어    79.8\n과학    69.8\n\n수학-영어 상관계수: 0.02',
    hint: 'corr = df["수학"].corr(df["영어"]) 를 사용하세요.',
    packages: ['numpy', 'pandas'],
  },

  // ═══════════════════════════════════════════
  // CH4: Scikit-learn 입문
  // ═══════════════════════════════════════════

  'python-ml-practice-ch4-s1': {
    title: 'ML 파이프라인 실습',
    description: '데이터를 훈련/테스트로 분할하고 간단한 모델을 학습해보세요.',
    initialCode: `import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression

# 데이터 생성 (공부시간 → 시험점수)
np.random.seed(42)
X = np.random.rand(100, 1) * 10  # 0~10시간
y = 3 * X.ravel() + 20 + np.random.randn(100) * 5  # y = 3x + 20 + noise

# TODO: 훈련/테스트 분할 (80:20, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

print(f"훈련 데이터: {X_train.shape[0]}개")
print(f"테스트 데이터: {X_test.shape[0]}개")

# 모델 학습
model = LinearRegression()
model.fit(X_train, y_train)

print(f"기울기: {model.coef_[0]:.2f}")
print(f"절편: {model.intercept_:.2f}")`,
    expectedOutput: '훈련 데이터: 80개\n테스트 데이터: 20개\n기울기: 3.10\n절편: 19.64',
    hint: 'train_test_split(X, y, test_size=0.2, random_state=42)를 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch4-s2': {
    title: '데이터 스케일링 실습',
    description: 'StandardScaler로 데이터를 정규화하고 효과를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.preprocessing import StandardScaler

# 다른 스케일의 특성 데이터
np.random.seed(42)
data = np.array([
    [25, 50000, 3],
    [30, 60000, 5],
    [35, 80000, 8],
    [40, 70000, 6],
    [28, 55000, 4],
], dtype=float)

print("원본 데이터 평균:", np.round(data.mean(axis=0), 1))
print("원본 데이터 표준편차:", np.round(data.std(axis=0), 1))

# TODO: StandardScaler로 정규화하세요
scaler = StandardScaler()
scaled = scaler.fit_transform(data)

print("\\n정규화 후 평균:", np.round(scaled.mean(axis=0), 1))
print("정규화 후 표준편차:", np.round(scaled.std(axis=0), 1))`,
    expectedOutput: '원본 데이터 평균: [3.16e+01 6.30e+04 5.20e+00]\n원본 데이터 표준편차: [5.31e+00 1.02e+04 1.72e+00]\n\n정규화 후 평균: [0. 0. 0.]\n정규화 후 표준편차: [1. 1. 1.]',
    hint: 'scaler = StandardScaler() 후 scaler.fit_transform(data)를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch4-s3': {
    title: '교차 검증 실습',
    description: 'cross_val_score로 모델 성능을 안정적으로 평가해보세요.',
    initialCode: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import cross_val_score

# 데이터 생성
np.random.seed(42)
X = np.random.rand(100, 1) * 10
y = 2.5 * X.ravel() + 15 + np.random.randn(100) * 3

# TODO: 5-fold 교차 검증으로 R² 점수를 구하세요
model = LinearRegression()
scores = cross_val_score(model, X, y, cv=5, scoring="r2")

print(f"각 폴드 R² 점수: {np.round(scores, 3)}")
print(f"평균 R²: {scores.mean():.3f}")
print(f"표준편차: {scores.std():.3f}")`,
    expectedOutput: '각 폴드 R² 점수: [0.862 0.893 0.879 0.869 0.814]\n평균 R²: 0.863\n표준편차: 0.027',
    hint: 'cross_val_score(model, X, y, cv=5, scoring="r2")로 5-fold CV를 수행합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // CH5: 지도학습 실습
  // ═══════════════════════════════════════════

  'python-ml-practice-ch5-s1': {
    title: '회귀 모델 실습',
    description: '선형 회귀와 다항 회귀를 비교하고 R² 점수를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
from sklearn.metrics import r2_score

# 비선형 데이터 생성
np.random.seed(42)
X = np.sort(np.random.rand(50, 1) * 6, axis=0)
y = np.sin(X).ravel() + np.random.randn(50) * 0.1

# 1. 단순 선형 회귀
lr = LinearRegression()
lr.fit(X, y)
y_pred_lr = lr.predict(X)
print(f"선형 회귀 R²: {r2_score(y, y_pred_lr):.3f}")

# 2. TODO: 3차 다항 회귀를 적용하세요
poly = PolynomialFeatures(degree=3)
X_poly = poly.fit_transform(X)
pr = LinearRegression()
pr.fit(X_poly, y)
y_pred_pr = pr.predict(X_poly)
print(f"다항 회귀 R²: {r2_score(y, y_pred_pr):.3f}")`,
    expectedOutput: '선형 회귀 R²: 0.048\n다항 회귀 R²: 0.919',
    hint: 'PolynomialFeatures(degree=3)으로 특성을 변환한 후 LinearRegression을 적용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch5-s2': {
    title: '분류 모델 실습',
    description: '로지스틱 회귀와 SVM으로 분류하고 정확도를 비교해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.svm import SVC
from sklearn.metrics import accuracy_score

# 분류 데이터 생성
X, y = make_classification(n_samples=200, n_features=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. 로지스틱 회귀
lr = LogisticRegression(random_state=42)
lr.fit(X_train, y_train)
print(f"로지스틱 회귀: {accuracy_score(y_test, lr.predict(X_test)):.3f}")

# 2. TODO: SVM (kernel='rbf') 모델을 학습하고 정확도를 출력하세요
svm = SVC(kernel="rbf", random_state=42)
svm.fit(X_train, y_train)
print(f"SVM: {accuracy_score(y_test, svm.predict(X_test)):.3f}")`,
    expectedOutput: '로지스틱 회귀: 0.917\nSVM: 0.917',
    hint: 'SVC(kernel="rbf", random_state=42)로 SVM 모델을 생성하고 fit, predict를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch5-s3': {
    title: '앙상블 학습 실습',
    description: 'RandomForest와 GradientBoosting을 비교해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.metrics import accuracy_score

# 데이터 생성
X, y = make_classification(n_samples=300, n_features=6, n_informative=4, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 1. Random Forest
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)
print(f"Random Forest: {accuracy_score(y_test, rf.predict(X_test)):.3f}")

# 2. Gradient Boosting
gb = GradientBoostingClassifier(n_estimators=100, random_state=42)
gb.fit(X_train, y_train)
print(f"Gradient Boosting: {accuracy_score(y_test, gb.predict(X_test)):.3f}")

# 3. 특성 중요도 (Random Forest)
importances = rf.feature_importances_
print(f"\\n특성 중요도: {np.round(importances, 3)}")`,
    expectedOutput: 'Random Forest: 0.933\nGradient Boosting: 0.956\n\n특성 중요도: [0.134 0.299 0.069 0.312 0.092 0.093]',
    hint: 'RandomForestClassifier와 GradientBoostingClassifier 모두 n_estimators=100, random_state=42를 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // CH6: 비지도학습과 모델 평가
  // ═══════════════════════════════════════════

  'python-ml-practice-ch6-s1': {
    title: '클러스터링 실습',
    description: 'K-Means로 데이터를 그룹화하고 결과를 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.cluster import KMeans
from sklearn.datasets import make_blobs

# 3개 그룹의 데이터 생성
X, y_true = make_blobs(n_samples=150, centers=3, cluster_std=1.0, random_state=42)

# TODO: K-Means (k=3) 클러스터링 수행
kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans.fit(X)

# 결과 확인
labels = kmeans.labels_
print(f"클러스터별 개수: {np.bincount(labels)}")
print(f"관성(Inertia): {kmeans.inertia_:.1f}")

# 중심점
centers = kmeans.cluster_centers_
for i, c in enumerate(centers):
    print(f"클러스터 {i} 중심: ({c[0]:.1f}, {c[1]:.1f})")`,
    expectedOutput: '클러스터별 개수: [50 50 50]\n관성(Inertia): 152.0\n클러스터 0 중심: (-7.5, -1.6)\n클러스터 1 중심: (1.6, 4.1)\n클러스터 2 중심: (-1.5, 2.8)',
    hint: 'KMeans(n_clusters=3, random_state=42, n_init=10)으로 객체를 생성하고 fit(X)를 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch6-s2': {
    title: 'PCA 차원 축소 실습',
    description: '4차원 데이터를 2차원으로 축소하고 분산 비율을 확인해보세요.',
    initialCode: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.datasets import load_iris

# Iris 데이터 로드 (4차원)
iris = load_iris()
X = iris.data
print(f"원본 차원: {X.shape}")

# TODO: PCA로 2차원으로 축소하세요
pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)
print(f"축소 차원: {X_reduced.shape}")

# 분산 설명 비율
print(f"\\n각 주성분 분산 비율: {np.round(pca.explained_variance_ratio_, 3)}")
print(f"총 분산 설명: {pca.explained_variance_ratio_.sum():.3f}")`,
    expectedOutput: '원본 차원: (150, 4)\n축소 차원: (150, 2)\n\n각 주성분 분산 비율: [0.925 0.053]\n총 분산 설명: 0.978',
    hint: 'PCA(n_components=2)로 객체를 생성하고 fit_transform(X)을 호출합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  'python-ml-practice-ch6-s3': {
    title: '모델 평가 실습',
    description: '혼동 행렬과 정밀도/재현율을 계산하여 모델을 종합 평가해보세요.',
    initialCode: `import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix

# 데이터 생성
X, y = make_classification(n_samples=200, n_features=5, random_state=42)
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 모델 학습
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

# 평가 지표 출력
print(f"정확도: {accuracy_score(y_test, y_pred):.3f}")
print(f"정밀도: {precision_score(y_test, y_pred):.3f}")
print(f"재현율: {recall_score(y_test, y_pred):.3f}")
print(f"F1 점수: {f1_score(y_test, y_pred):.3f}")

# 혼동 행렬
cm = confusion_matrix(y_test, y_pred)
print(f"\\n혼동 행렬:\\n{cm}")`,
    expectedOutput: '정확도: 0.917\n정밀도: 0.935\n재현율: 0.906\nF1 점수: 0.921\n\n혼동 행렬:\n[[26  2]\n [ 3 29]]',
    hint: 'sklearn.metrics에서 accuracy_score, precision_score, recall_score, f1_score, confusion_matrix를 임포트하여 사용합니다.',
    packages: ['numpy', 'scikit-learn'],
  },

  // ═══════════════════════════════════════════
  // AI 입문 코스 - 초등학생용 Python 실습
  // ═══════════════════════════════════════════

  'ai-intro-ch1-s1': {
    title: '🎉 첫 번째 코드 실행하기!',
    description: 'print()는 화면에 글자를 보여주는 마법 주문이에요. 큰따옴표 안에 원하는 말을 넣어보세요!',
    initialCode: `# 화면에 인사말을 출력해보세요!
# print() 안에 원하는 말을 넣으면 화면에 나타나요

print("안녕, 나는 AI야!")

# 아래에 여러분의 인사말도 추가해보세요!
`,
    expectedOutput: '안녕, 나는 AI야!',
    hint: 'print("여기에 하고 싶은 말을 넣으세요") 이렇게 쓰면 돼요! 큰따옴표("")를 꼭 넣어야 해요.',
    packages: [],
  },

  'ai-intro-ch1-s2': {
    title: '🔢 컴퓨터로 계산하기',
    description: 'Python은 아주 똑똑한 계산기예요! 더하기(+), 빼기(-), 곱하기(*), 나누기(/)를 해볼까요?',
    initialCode: `# 컴퓨터로 계산해보세요!
print(3 + 5)
print(10 - 4)
print(6 * 7)

# 아래에 여러분만의 계산을 추가해보세요!
`,
    expectedOutput: '8\n6\n42',
    hint: '더하기는 +, 빼기는 -, 곱하기는 *, 나누기는 / 기호를 사용해요.',
    packages: [],
  },

  'ai-intro-ch2-s1': {
    title: '📦 변수에 저장하기',
    description: '변수는 값을 담아두는 상자예요. 이름을 붙여서 나중에 다시 꺼내 쓸 수 있어요!',
    initialCode: `# 변수에 값을 저장해보세요!
이름 = "민수"
나이 = 11
학교 = "행복초등학교"

print(이름 + "는 " + str(나이) + "살이에요")
print(학교 + " 학생이에요")

# 여러분의 정보로 바꿔보세요!
`,
    expectedOutput: '민수는 11살이에요\n행복초등학교 학생이에요',
    hint: '이름 = "내이름" 이렇게 큰따옴표 안에 글자를 넣으면 돼요. 숫자는 따옴표 없이 써요!',
    packages: [],
  },

  'ai-intro-ch2-s2': {
    title: '📋 리스트 만들기',
    description: '리스트는 여러 개의 물건을 한 줄로 정리하는 서랍이에요. 대괄호 []로 만들어요!',
    initialCode: `# 좋아하는 과일 리스트를 만들어보세요!
과일 = ["사과", "바나나", "딸기"]

print("내가 좋아하는 과일:")
for 하나 in 과일:
    print("- " + 하나)

print("총 " + str(len(과일)) + "가지!")

# 과일을 더 추가해보세요! (쉼표로 구분)
`,
    expectedOutput: '내가 좋아하는 과일:\n- 사과\n- 바나나\n- 딸기\n총 3가지!',
    hint: '리스트에 추가하려면 과일 = ["사과", "바나나", "딸기", "포도"] 이렇게 쉼표 뒤에 넣으면 돼요!',
    packages: [],
  },

  'ai-intro-ch3-s1': {
    title: '🔄 반복문으로 인사하기',
    description: 'for 반복문은 같은 일을 여러 번 해주는 마법이에요. "5번 인사해!" 같은 명령을 내릴 수 있어요.',
    initialCode: `# 5번 반복해서 인사해보세요!
for i in range(5):
    print(str(i + 1) + "번째: 안녕하세요!")

print("인사 끝!")

# range(5)의 숫자를 바꿔서 횟수를 조절해보세요!
`,
    expectedOutput: '1번째: 안녕하세요!\n2번째: 안녕하세요!\n3번째: 안녕하세요!\n4번째: 안녕하세요!\n5번째: 안녕하세요!\n인사 끝!',
    hint: 'range(5)는 0부터 4까지 5번 반복해요. range(10)으로 바꾸면 10번 반복해요!',
    packages: [],
  },

  'ai-intro-ch3-s2': {
    title: '🤖 AI처럼 판단하기',
    description: 'AI는 조건을 보고 판단해요. if/else를 사용하면 컴퓨터도 판단할 수 있어요!',
    initialCode: `# AI처럼 동물을 분류해보세요!
def 동물_분류(다리수, 날개있음):
    if 날개있음:
        return "새"
    elif 다리수 == 4:
        return "포유류"
    elif 다리수 == 0:
        return "뱀 또는 물고기"
    else:
        return "기타 동물"

# 동물들을 분류해봅시다!
print("참새:", 동물_분류(2, True))
print("강아지:", 동물_분류(4, False))
print("뱀:", 동물_분류(0, False))
print("고양이:", 동물_분류(4, False))
`,
    expectedOutput: '참새: 새\n강아지: 포유류\n뱀: 뱀 또는 물고기\n고양이: 포유류',
    hint: 'if는 "만약 ~라면"이에요. elif는 "그게 아니고 ~라면", else는 "그 외에는"이에요. AI도 이런 규칙으로 판단해요!',
    packages: [],
  },
}
